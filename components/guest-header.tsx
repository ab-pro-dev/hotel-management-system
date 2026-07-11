"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import Link from "next/link";
import NotificationBell from "@/components/notification-bell";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
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
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <span className="text-lg font-semibold">{t("common.hotelName")}</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/rooms"
            className="text-muted-foreground hover:text-foreground"
          >
            {t("nav.rooms")}
          </Link>
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
              <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border bg-background shadow-md">
                {LOCALES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => switchLocale(l.value)}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-accent ${
                      locale === l.value ? "font-medium bg-accent" : ""
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
