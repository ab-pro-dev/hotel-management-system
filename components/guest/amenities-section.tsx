import { Button } from "@/components/ui/button";
import {
  Wifi,
  Waves,
  Dumbbell,
  Sparkles,
  ConciergeBell,
  Car,
} from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    description: "High-speed internet throughout the property",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Infinity pool with panoramic city views",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art equipment and trainers",
  },
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Rejuvenating treatments and therapies",
  },
  {
    icon: ConciergeBell,
    title: "24/7 Room Service",
    description: "Gourmet dining delivered to your room",
  },
  {
    icon: Car,
    title: "Secure Parking",
    description: "Valet and self-parking available",
  },
];

export default function AmenitiesSection() {
  return (
    <section id="amenities" className="bg-charcoal py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — Amenities
            </p>
            <h2 className="font-heading text-3xl font-light text-cream sm:text-4xl">
              Facilities for Your Comfort
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/60">
              Everything you need for a perfect stay, from relaxation to
              recreation, all within reach.
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-gold/40 text-gold hover:bg-gold/10"
          >
            View All Amenities
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-white/5 bg-white/5 p-6 transition-colors hover:border-gold/20 hover:bg-gold/5"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 transition-colors group-hover:bg-gold/20">
                <item.icon className="size-6 text-gold" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-cream">
                {item.title}
              </h3>
              <p className="text-sm text-cream/50">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
