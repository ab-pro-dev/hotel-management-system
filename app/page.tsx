import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grand Raya Hotel — Boutique Luxury Redefined",
  description:
    "Experience refined elegance at Grand Raya Hotel. Modern architecture, serene surroundings, and impeccable hospitality await.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero.jpg"
          alt="Grand Raya Hotel exterior at dusk"
          fill
          priority
          className="object-cover object-center"
          quality={90}
          sizes="100vw"
        />

        {/* Dark overlay gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,16,12,0.45) 0%, rgba(20,16,12,0.65) 50%, rgba(20,16,12,0.85) 100%)",
          }}
        />

        {/* Top navigation bar */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10 md:px-16">
          <span
            className="text-sm tracking-[0.35em] uppercase"
            style={{ color: "rgba(235,225,210,0.85)", fontFamily: "var(--font-heading)" }}
          >
            Grand Raya
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/rooms"
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: "rgba(235,225,210,0.7)" }}
              onMouseEnter={undefined}
            >
              Rooms
            </Link>
            <Link
              href="/login"
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: "rgba(235,225,210,0.7)" }}
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Decorative line */}
          <div
            className="mb-8 h-px w-12"
            style={{ backgroundColor: "rgba(235,225,210,0.35)" }}
          />

          <p
            className="mb-4 text-xs tracking-[0.4em] uppercase"
            style={{ color: "rgba(235,225,210,0.7)" }}
          >
            Boutique Luxury
          </p>

          <h1
            className="max-w-2xl text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "var(--font-heading)",
              color: "rgba(245,240,230,0.95)",
              fontWeight: 400,
            }}
          >
            Grand Raya Hotel
          </h1>

          <p
            className="mt-5 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ color: "rgba(235,225,210,0.65)" }}
          >
            Where modern architecture meets timeless hospitality.
          </p>

          {/* CTA */}
          <Link
            href="/rooms"
            className="group mt-10 inline-flex items-center gap-3 border px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-all duration-500"
            style={{
              borderColor: "rgba(235,225,210,0.3)",
              color: "rgba(235,225,210,0.9)",
            }}
            id="browse-rooms-cta"
          >
            Browse Rooms
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Decorative line */}
          <div
            className="mt-16 h-px w-12"
            style={{ backgroundColor: "rgba(235,225,210,0.2)" }}
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div
            className="flex flex-col items-center gap-2"
            style={{ color: "rgba(235,225,210,0.4)" }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="h-8 w-px animate-pulse" style={{ backgroundColor: "rgba(235,225,210,0.3)" }} />
          </div>
        </div>
      </section>

      {/* ── Intro Section ────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32 md:py-40">
          {/* Decorative element */}
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px w-8 bg-border" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              Est. 2024
            </span>
            <div className="h-px w-8 bg-border" />
          </div>

          <h2 className="text-2xl leading-snug tracking-tight sm:text-3xl md:text-4xl">
            A Retreat Designed for Stillness
          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Nestled between lush tropical landscapes and clean architectural lines,
            Grand Raya Hotel offers an intimate escape where every detail has been
            considered. Our rooms blend natural materials with modern comfort,
            creating spaces that feel both grounding and elevated.
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Whether you seek quiet reflection by the pool or the vibrant culture of
            the surrounding area, Grand Raya is your home away from home.
          </p>

          {/* Secondary CTA */}
          <Link
            href="/rooms"
            className="mt-12 inline-flex items-center gap-3 border border-border px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-foreground transition-all duration-500 hover:border-foreground hover:bg-foreground hover:text-background"
            id="explore-rooms-cta"
          >
            Explore Our Rooms
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <span
            className="text-sm tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Grand Raya Hotel
          </span>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Grand Raya Hotel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
