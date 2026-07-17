import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signIn } from "@/auth";

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
    })
  : null;

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate limit: 5 attempts per hour per IP
  if (ratelimit) {
    const { success, reset } = await ratelimit.limit(`staff-login:${ip}`);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      // Log the rate-limited attempt
      let email = "unknown";
      try {
        const body = await req.clone().json();
        email = body.email ?? "unknown";
      } catch {
        // unparseable body
      }
      await logFailedAttempt(ip, email);

      return NextResponse.json(
        { error: "Too many login attempts. Please try again later.", retryAfter },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // Parse request body
  let email: string;
  let password: string;
  try {
    const body = await req.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  // Validate credentials (same logic as auth.ts authorize callback)
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    await logFailedAttempt(ip, email);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await logFailedAttempt(ip, email);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Credentials valid — create session via NextAuth signIn
  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInResult?.error) {
    await logFailedAttempt(ip, email);
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // signIn with redirect: false returns a redirect URL on success
  return NextResponse.json({ ok: true, url: signInResult?.url ?? "/dashboard" });
}

async function logFailedAttempt(ip: string, email: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action: "STAFF_LOGIN_FAILED",
        targetTable: "User",
        targetId: "unknown",
        metadata: { ip, email, timestamp: new Date().toISOString() },
      },
    });
  } catch {
    // Don't fail the request if audit logging fails
  }
}
