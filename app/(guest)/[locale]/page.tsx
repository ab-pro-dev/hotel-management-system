import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { Star } from "lucide-react";
import prisma from "@/lib/prisma";
import BookingWidget from "@/components/booking-widget";

export const metadata: Metadata = {
  title: "Grand Raya Hotel — Boutique Luxury Redefined",
  description:
    "Experience refined elegance at Grand Raya Hotel. Modern architecture, serene surroundings, and impeccable hospitality await.",
};

async function getFeaturedRooms() {
  return prisma.roomType.findMany({
    take: 3,
    orderBy: { basePrice: "asc" },
    include: {
      rooms: {
        where: { status: "AVAILABLE" },
        take: 1,
      },
    },
  });
}

async function getTopReviews() {
  return prisma.review.findMany({
    where: { hidden: false, rating: { gte: 4 } },
    take: 4,
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    include: {
      booking: {
        include: {
          guest: { select: { name: true } },
          room: { include: { roomType: { select: { title: true } } } },
        },
      },
    },
  });
}

// Map amenity values to readable labels
const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  tv: "TV",
  "air-conditioning": "A/C",
  "coffee-maker": "Coffee Maker",
  minibar: "Minibar",
  balcony: "Balcony",
  bathrobe: "Bathrobe",
  "soaking-tub": "Soaking Tub",
  "city-views": "City Views",
  "pet-friendly": "Pet Friendly",
};

export default async function HomePage() {
  const [featuredRooms, topReviews] = await Promise.all([
    getFeaturedRooms(),
    getTopReviews(),
  ]);

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
              "linear-gradient(to bottom, rgba(20,16,12,0.45) 0%, rgba(20,16,12,0.65) 50%, rgba(20,16,12,0.88) 100%)",
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
        <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
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

          {/* ── Inline Booking Widget ────── */}
          <BookingWidget />

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
            className="mt-12 inline-flex items-center gap-3 border border-primary px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
            id="explore-rooms-cta"
          >
            Explore Our Rooms
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Featured Rooms ───────────────────────────────────── */}
      {featuredRooms.length > 0 && (
        <section className="bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            {/* Section header */}
            <div className="mb-14 flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-border" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                  Accommodations
                </span>
                <div className="h-px w-8 bg-border" />
              </div>
              <h2
                className="text-2xl tracking-tight sm:text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
              >
                Featured Rooms
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Hand-selected accommodations that define the Grand Raya experience.
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRooms.map((room) => {
                const price = Number(room.basePrice);
                const isAvailable = room.rooms.length > 0;

                // Spec row: size from amenities or omit, capacity, bed type from title
                const specItems: { label: string; value: string }[] = [
                  {
                    label: "Capacity",
                    value: `${room.capacity} ${room.capacity === 1 ? "guest" : "guests"}`,
                  },
                  {
                    label: "From",
                    value: `$${price.toFixed(0)} / night`,
                  },
                ];

                // Surface a few amenities as a readable spec
                const firstAmenities = room.amenities
                  .slice(0, 3)
                  .map((a) => AMENITY_LABELS[a] ?? a)
                  .join(", ");

                return (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}`}
                    className="group flex flex-col bg-background transition-colors duration-300 hover:bg-muted/50"
                  >
                    {/* Top accent bar */}
                    <div className="h-px w-full bg-border transition-colors duration-300 group-hover:bg-primary/40" />

                    <div className="flex flex-1 flex-col p-7">
                      {/* Availability dot */}
                      <div className="mb-5 flex items-center gap-2">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            isAvailable ? "bg-primary" : "bg-muted-foreground/40"
                          }`}
                        />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          {isAvailable ? "Available" : "Ask for availability"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-xl tracking-tight"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
                      >
                        {room.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {room.description}
                      </p>

                      {/* Spec row */}
                      <div className="mt-6 space-y-2 border-t border-border pt-5">
                        {specItems.map((spec) => (
                          <div key={spec.label} className="flex items-baseline justify-between">
                            <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                              {spec.label}
                            </span>
                            <span className="text-sm font-medium">{spec.value}</span>
                          </div>
                        ))}
                        {firstAmenities && (
                          <div className="flex items-baseline justify-between">
                            <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                              Includes
                            </span>
                            <span className="text-sm">{firstAmenities}</span>
                          </div>
                        )}
                      </div>

                      {/* View link */}
                      <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-primary">
                        <span>View Room</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* View all link */}
            <div className="mt-12 text-center">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-3 border border-primary px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
              >
                View All Rooms
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Guest Reviews ────────────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            {/* Section header */}
            <div className="mb-14 flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-border" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                  Guest Voices
                </span>
                <div className="h-px w-8 bg-border" />
              </div>
              <h2
                className="text-2xl tracking-tight sm:text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
              >
                What Our Guests Say
              </h2>
            </div>

            {/* Review cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topReviews.map((review) => {
                const guestName = review.booking.guest.name;
                // Show first name + last initial for privacy
                const parts = guestName.trim().split(" ");
                const displayName =
                  parts.length > 1
                    ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                    : parts[0];

                const roomTitle = review.booking.room.roomType.title;

                return (
                  <div
                    key={review.id}
                    className="flex flex-col bg-muted/30 p-6"
                  >
                    {/* Stars */}
                    <div className="mb-4 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* Attribution */}
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="mt-0.5 text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                        {roomTitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
