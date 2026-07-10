import { auth } from "./auth";
import { NextResponse } from "next/server";

const staffRoles = ["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/(staff)/admin")) {
    if (!role || role !== "ADMIN") {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname.startsWith("/(staff)")) {
    if (!role || !staffRoles.includes(role)) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/(staff)/:path*"],
};
