"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import NotificationBell from "@/components/notification-bell";

export default function StaffHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const homeHref =
    role === "ADMIN"
      ? "/admin"
      : role === "RECEPTIONIST"
        ? "/reception"
        : "/housekeeping";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={homeHref} className="font-heading text-lg tracking-tight">
            {t("common.hotelName")}
          </Link>
          <nav className="flex items-center gap-5">
            {role === "ADMIN" && (
              <>
                <Link
                  href="/admin/manage"
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname.startsWith("/admin/manage")
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("nav.manage")}
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname.startsWith("/admin/analytics")
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("nav.analytics")}
                </Link>
                <Link
                  href="/admin/bookings"
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname.startsWith("/admin/bookings")
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  href="/admin/pricing"
                  className={`text-sm transition-colors hover:text-foreground ${
                    pathname.startsWith("/admin/pricing")
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}
            {role === "RECEPTIONIST" && (
              <Link
                href="/reception"
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname.startsWith("/reception")
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.reception")}
              </Link>
            )}
            {role === "HOUSEKEEPER" && (
              <Link
                href="/housekeeping"
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname.startsWith("/housekeeping")
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {t("nav.housekeeping")}
              </Link>
            )}
          </nav>
        </div>
        <nav className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href="/rooms"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Guest site
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
