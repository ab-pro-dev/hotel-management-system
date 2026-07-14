import { auth } from "./auth";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const locales = ["en", "am"];
const defaultLocale = "en";

function getLocale(req: Request): string {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/NEXT_LOCALE=([^;]+)/);
  if (match && locales.includes(match[1])) return match[1];

  const acceptLang = req.headers.get("accept-language") ?? "";
  for (const loc of locales) {
    if (acceptLang.toLowerCase().includes(loc)) return loc;
  }
  return defaultLocale;
}

function hasLocalePrefix(pathname: string): boolean {
  return locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
}

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
    })
  : null;

async function rateLimit(ip: string) {
  if (!ratelimit) return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 };
  return ratelimit.limit(ip);
}

const i18nMiddleware = async (req: Request, locale: string) => {
  const url = new URL(req.url);
  const { pathname } = url;

  if (!hasLocalePrefix(pathname)) {
    const redirectUrl = new URL(`/${locale}${pathname}`, url.origin);
    url.searchParams.forEach((v, k) => redirectUrl.searchParams.set(k, v));
    return NextResponse.redirect(redirectUrl);
  }
  return null;
};

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;
  const locale = getLocale(req);

  const i18nRedirect = await i18nMiddleware(req, locale);
  if (i18nRedirect) return i18nRedirect;

  const pathnameWithoutLocale = pathname.replace(/^\/(en|am)(\/|$)/, "/") || "/";

  if (pathnameWithoutLocale.startsWith("/login") || pathnameWithoutLocale.startsWith("/book")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? req.headers.get("x-real-ip")
      ?? "127.0.0.1";

    const { success, reset } = await rateLimit(ip);

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

  if (pathnameWithoutLocale.startsWith("/admin")) {
    if (!role || role !== "ADMIN") {
      const loginUrl = new URL(`/${locale}/login`, req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathnameWithoutLocale.startsWith("/reception")) {
    if (!role || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(role)) {
      const loginUrl = new URL(`/${locale}/login`, req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathnameWithoutLocale.startsWith("/housekeeping")) {
    if (!role || !["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"].includes(role)) {
      const loginUrl = new URL(`/${locale}/login`, req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon-192.svg|icon-512.svg|manifest.json|sw.js).*)",
  ],
};
