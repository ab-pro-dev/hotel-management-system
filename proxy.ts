import { auth } from "./auth";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

async function rateLimit(ip: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  return { success, limit, remaining, reset };
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/login") || pathname.startsWith("/book")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? req.headers.get("x-real-ip")
      ?? "127.0.0.1";

    const { success, remaining, reset } = await rateLimit(ip);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!role || role !== "ADMIN") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/reception")) {
    if (!role || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(role)) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/housekeeping")) {
    if (!role || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(role)) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/book/:path*", "/admin/:path*", "/reception/:path*", "/housekeeping/:path*"],
};
