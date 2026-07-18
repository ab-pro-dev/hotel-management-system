"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Amenities", href: "/amenities" },
  { label: "Dining", href: "/dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function GuestHeader() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal/95 shadow-lg backdrop-blur-md"
          : "bg-charcoal/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold font-heading text-lg font-semibold text-gold">
            GR
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="font-heading text-sm font-semibold tracking-widest text-cream">
              GRAND RAYA
            </div>
            <div className="font-heading text-[10px] tracking-[0.3em] text-gold">
              HOTEL
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                className="text-cream hover:bg-white/10 hover:text-gold"
                size="sm"
              >
                Sign In
              </Button>
              <Button
                className="bg-gold text-charcoal hover:bg-gold-light"
                size="sm"
              >
                Book Now
              </Button>
            </>
          )}

          {/* Mobile menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="text-cream" />}
              >
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-charcoal bg-charcoal p-0">
                <SheetHeader className="border-b border-white/10 p-4">
                  <SheetTitle className="font-heading text-lg text-cream">
                    GRAND RAYA HOTEL
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="rounded-md px-3 py-2.5 text-sm text-cream/80 transition-colors hover:bg-white/10 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 border-t border-white/10 p-4">
                  <Button
                    variant="ghost"
                    className="w-full text-cream hover:bg-white/10 hover:text-gold"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-gold text-charcoal hover:bg-gold-light">
                    Book Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
