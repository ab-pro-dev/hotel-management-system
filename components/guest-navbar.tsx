"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { User, Globe, Menu, X } from "lucide-react";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "am", label: "አማርኛ" },
] as const;

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Contact", href: "#contact" },
];

export default function GuestNavbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setLangOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="#top" className="font-heading text-xl tracking-tight text-foreground">
          Grand Raya Hotel
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors duration-300 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="#rooms"
            className="hidden rounded-md bg-primary px-5 py-2 text-xs font-medium tracking-[0.15em] uppercase text-primary-foreground transition-all duration-300 hover:bg-primary/90 sm:inline-block"
          >
            Book Now
          </a>

          <Link
            href="/login"
            className={`transition-colors duration-300 ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-foreground/70 hover:text-foreground"
            }`}
            aria-label="Sign in"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">{locale === "en" ? "EN" : "AM"}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-border bg-background shadow-lg">
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden transition-colors duration-300 ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-foreground/70 hover:text-foreground"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#rooms"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-block rounded-md bg-primary px-5 py-2.5 text-center text-xs font-medium tracking-[0.15em] uppercase text-primary-foreground"
            >
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
