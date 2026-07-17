"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, ChevronUp, Globe, Share2, MessageCircle } from "lucide-react";

const quickLinks = [
  "Home",
  "Rooms & Suites",
  "Amenities",
  "Dining",
  "Gallery",
  "About Us",
  "Contact",
];

const services = [
  "Room Service",
  "Airport Transfer",
  "Laundry Service",
  "Spa & Wellness",
  "Event & Meeting",
  "Concierge",
];

const support = [
  "FAQ",
  "Privacy Policy",
  "Terms & Conditions",
  "Cancellation Policy",
];

export default function SiteFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-charcoal pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold font-heading text-sm font-semibold text-gold">
              GR
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-cream/50">
              Where timeless elegance meets modern comfort.
            </p>
          </div>
          <div className="flex gap-3">
            {[Globe, Share2, MessageCircle].map((Icon, i) => (
              <button
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/50 transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        <Separator className="mb-12 bg-white/10" />

        {/* Link columns */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Our Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5">
              {support.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-cream/50">
              Subscribe to receive exclusive offers and updates.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="h-9 border-white/10 bg-white/5 text-cream placeholder:text-cream/30"
              />
              <Button size="icon" className="h-9 w-9 shrink-0 bg-gold text-charcoal">
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between pb-8">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} Grand Raya Hotel. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/40 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ChevronUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
