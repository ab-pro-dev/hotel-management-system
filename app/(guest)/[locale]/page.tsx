import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { Star, Wifi, Waves, UtensilsCrossed, Dumbbell, Wine, Car, ConciergeBell, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import BookingWidget from "@/components/booking-widget";
import GuestNavbar from "@/components/guest-navbar";

export const metadata: Metadata = {
  title: "Grand Raya Hotel — Warm Luxury Resort",
  description:
    "Experience warm, refined elegance at Grand Raya Hotel. Lush surroundings, burnished gold accents, and impeccable hospitality.",
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

async function getProperty() {
  return prisma.property.findFirst();
}

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

const HOTEL_AMENITIES = [
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: UtensilsCrossed, label: "Fine Dining" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: Wine, label: "Rooftop Bar" },
  { icon: Car, label: "Valet Parking" },
  { icon: ConciergeBell, label: "24/7 Concierge" },
  { icon: Sparkles, label: "Luxury Spa" },
];

export default async function HomePage() {
  const [featuredRooms, topReviews, property] = await Promise.all([
    getFeaturedRooms(),
    getTopReviews(),
    getProperty(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Sticky Navbar ──────────────────────────────────── */}
      <GuestNavbar />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/hero.jpg"
          alt="Grand Raya Hotel — warm golden-hour lighting over lush tropical gardens"
          fill
          priority
          className="object-cover object-center"
          quality={90}
          sizes="100vw"
        />

        {/* Warm overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.20 0.04 50 / 0.35) 0%, oklch(0.20 0.04 50 / 0.50) 50%, oklch(0.20 0.04 50 / 0.80) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
          {/* Decorative line */}
          <div className="mb-8 h-px w-12 bg-primary/40" />

          <p className="mb-4 text-xs tracking-[0.4em] uppercase text-primary/80">
            Warm Luxury Resort
          </p>

          <h1 className="max-w-2xl text-4xl leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Grand Raya Hotel
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/60 sm:text-base">
            Where burnished gold meets timeless hospitality.
          </p>

          {/* ── Inline Booking Widget ────── */}
          <BookingWidget />

          {/* Decorative line */}
          <div className="mt-16 h-px w-12 bg-primary/20" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-foreground/40">
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="h-8 w-px animate-pulse bg-primary/30" />
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ───────────────────────────────────── */}
      {featuredRooms.length > 0 && (
        <section id="rooms" className="bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            {/* Section header */}
            <div className="mb-14 flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                  Accommodations
                </span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <h2 className="text-2xl tracking-tight sm:text-3xl md:text-4xl">
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

                const firstAmenities = room.amenities
                  .slice(0, 3)
                  .map((a) => AMENITY_LABELS[a] ?? a)
                  .join(", ");

                return (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.id}`}
                    className="group flex flex-col border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col p-7">
                      {/* Availability dot + badge */}
                      <div className="mb-5 flex items-center gap-3">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
                            isAvailable ? "bg-secondary" : "bg-muted-foreground/40"
                          }`}
                        />
                        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-secondary">
                          {isAvailable ? "Available" : "Ask for availability"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl tracking-tight">{room.title}</h3>

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
                className="inline-flex items-center gap-3 border border-primary px-8 py-3.5 text-xs font-medium tracking-[0.25em] uppercase text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
              >
                View All Rooms
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Amenities ────────────────────────────────────────── */}
      <section id="amenities" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          {/* Section header */}
          <div className="mb-14 flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                Experiences
              </span>
              <div className="h-px w-8 bg-primary/30" />
            </div>
            <h2 className="text-2xl tracking-tight sm:text-3xl md:text-4xl">
              Hotel Amenities
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Everything you need for an unforgettable stay.
            </p>
          </div>

          {/* Icon grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {HOTEL_AMENITIES.map((amenity) => (
              <div
                key={amenity.label}
                className="flex flex-col items-center gap-4 rounded-lg border border-border p-8 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <amenity.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guest Reviews ────────────────────────────────────── */}
      {topReviews.length > 0 && (
        <section className="bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            {/* Section header */}
            <div className="mb-14 flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                  Guest Voices
                </span>
                <div className="h-px w-8 bg-primary/30" />
              </div>
              <h2 className="text-2xl tracking-tight sm:text-3xl md:text-4xl">
                What Our Guests Say
              </h2>
            </div>

            {/* Review cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topReviews.map((review) => {
                const guestName = review.booking.guest.name;
                const parts = guestName.trim().split(" ");
                const displayName =
                  parts.length > 1
                    ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                    : parts[0];

                const roomTitle = review.booking.room.roomType.title;

                return (
                  <div
                    key={review.id}
                    className="flex flex-col border border-border bg-card p-6 transition-all duration-300 hover:shadow-sm"
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

      {/* ── Contact ───────────────────────────────────────────── */}
      <section id="contact" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left — Info */}
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
                  Get in Touch
                </span>
              </div>
              <h2 className="text-2xl tracking-tight sm:text-3xl md:text-4xl">
                Contact Us
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                We would love to hear from you. Reach out for reservations, inquiries, or special requests.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">Address</p>
                  <p className="mt-1 text-sm text-foreground">
                    {property?.address ?? "123 Grand Avenue, City Center"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">Phone</p>
                  <p className="mt-1 text-sm text-foreground">+1 (555) 234-5678</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm text-foreground">reservations@grandraya.com</p>
                </div>
              </div>
            </div>

            {/* Right — Location graphic */}
            <div className="flex items-center justify-center">
              <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {property?.name ?? "Grand Raya Hotel"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {property?.address ?? "123 Grand Avenue, City Center"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <span className="font-heading text-lg tracking-tight">Grand Raya Hotel</span>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A warm luxury resort where every detail has been considered.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground">
                Quick Links
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "Home", href: "#top" },
                  { label: "Rooms", href: "#rooms" },
                  { label: "Amenities", href: "#amenities" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>{property?.address ?? "123 Grand Avenue, City Center"}</li>
                <li>+1 (555) 234-5678</li>
                <li>reservations@grandraya.com</li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground">
                Front Desk
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Open 24 hours</li>
                <li>Concierge available</li>
                <li>Early check-in on request</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Grand Raya Hotel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
