"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  PlayCircle,
  Star,
  MapPin,
  Award,
  Wifi,
} from "lucide-react";

const highlights = [
  {
    icon: Star,
    title: "5 Star Luxury",
    subtitle: "Exceptional Hospitality",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    subtitle: "In the Heart of the City",
  },
  {
    icon: Award,
    title: "Award Winning",
    subtitle: "Excellence in Service",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    subtitle: "Stay Connected",
  },
];

export default function HeroSection() {
  return (
    <section className="relative bg-charcoal">
      {/* Hero background */}
      <div className="relative min-h-[85vh] overflow-hidden">
        {/* Placeholder image area */}
        {/* TODO: Replace with <Image src="/hero.jpg" alt="Grand Raya Hotel Lobby" fill className="object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — Welcome to Grand Raya Hotel
            </p>
            <h1 className="mb-6 font-heading text-5xl font-light leading-tight text-cream sm:text-6xl lg:text-7xl">
              Experience Luxury.
              <br />
              Feel at <span className="text-gold">Home.</span>
            </h1>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-cream/70">
              Where timeless elegance meets modern comfort. Your perfect stay
              begins here.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button className="gap-2 bg-gold px-6 py-6 text-charcoal hover:bg-gold-light">
                Explore Rooms
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="gap-2 text-cream hover:bg-white/10 hover:text-gold"
              >
                <PlayCircle className="size-5" />
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking widget bar */}
      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-charcoal/95 p-4 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:p-6">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-cream/50">
              Check-in
            </label>
            <Input
              type="date"
              className="h-11 border-white/10 bg-white/5 text-cream placeholder:text-cream/30"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-cream/50">
              Check-out
            </label>
            <Input
              type="date"
              className="h-11 border-white/10 bg-white/5 text-cream placeholder:text-cream/30"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-cream/50">
              Guests
            </label>
            <select className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-cream">
              <option>2 Adults, 1 Room</option>
              <option>1 Adult, 1 Room</option>
              <option>2 Adults, 2 Rooms</option>
              <option>3 Adults, 1 Room</option>
              <option>Family (2A + 2C), 1 Room</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button className="h-11 w-full bg-gold px-8 text-charcoal hover:bg-gold-light sm:w-auto">
              Check Availability
            </Button>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <item.icon className="size-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-cream">
                  {item.title}
                </h3>
                <p className="text-xs text-cream/50">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
