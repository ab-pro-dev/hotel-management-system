"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import NotificationBell from "@/components/notification-bell";
import { Button } from "@/components/ui/button";
import { Globe, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "am", label: "አማርኛ" },
] as const;

export default function GuestHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <span className="font-heading text-lg tracking-tight">{t("common.hotelName")}</span>
        <nav className="flex items-center gap-5">
          {(!role || role === "GUEST") && (
            <Link
              href="/rooms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.rooms")}
            </Link>
          )}

          {role === "ADMIN" && (
            <>
              <Link href="/admin/manage" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.manage")}
              </Link>
              <Link href="/admin/analytics" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.analytics")}
              </Link>
            </>
          )}

          {role === "RECEPTIONIST" && (
            <Link href="/reception" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("nav.reception")}
            </Link>
          )}

          {role === "HOUSEKEEPER" && (
            <Link href="/housekeeping" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("nav.housekeeping")}
            </Link>
          )}

          {!session && (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Sign in"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.signIn")}</span>
            </Link>
          )}

          <NotificationBell />
          <div className="relative" ref={ref}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setOpen(!open)}
            >
              <Globe className="h-4 w-4" />
              {locale === "en" ? "EN" : "AM"}
            </Button>
            {open && (
              <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-background">
                {LOCALES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => switchLocale(l.value)}
                    className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                      locale === l.value ? "font-medium bg-muted" : ""
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
