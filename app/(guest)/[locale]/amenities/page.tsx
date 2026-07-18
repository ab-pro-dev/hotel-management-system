import SiteFooter from "@/components/guest/site-footer";
import {
  Wifi,
  Waves,
  Dumbbell,
  Sparkles,
  ConciergeBell,
  Car,
  Shirt,
  Coffee,
  Lock,
  Tv,
  Airplay,
  Baby,
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
    description: "State-of-the-art equipment and personal trainers",
  },
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Rejuvenating treatments and holistic therapies",
  },
  {
    icon: ConciergeBell,
    title: "24/7 Room Service",
    description: "Gourmet dining delivered to your room any time",
  },
  {
    icon: Car,
    title: "Secure Parking",
    description: "Valet and self-parking available on-site",
  },
  {
    icon: Shirt,
    title: "Laundry & Dry Cleaning",
    description: "Same-day service for all guest garments",
  },
  {
    icon: Coffee,
    title: "Café & Lounge",
    description: "Artisan coffee, pastries, and light bites all day",
  },
  {
    icon: Lock,
    title: "In-Room Safe",
    description: "Electronic safe in every room for valuables",
  },
  {
    icon: Tv,
    title: "Smart TVs",
    description: "55-inch smart TVs with streaming in every room",
  },
  {
    icon: Airplay,
    title: "Airport Transfer",
    description: "Complimentary shuttle service to and from the airport",
  },
  {
    icon: Baby,
    title: "Family Friendly",
    description: "Cribs, rollaway beds, and kids club available",
  },
];

export default function AmenitiesPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Amenities
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
            Facilities for Your Comfort
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cream/60">
            Everything you need for a perfect stay, from relaxation to
            recreation, all within reach. Grand Raya Hotel offers a comprehensive
            range of amenities designed to make your visit effortless and
            enjoyable.
          </p>
        </div>
      </section>

      <section className="bg-charcoal pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <SiteFooter />
    </>
  );
}
