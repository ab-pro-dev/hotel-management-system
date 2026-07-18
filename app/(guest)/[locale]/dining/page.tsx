import SiteFooter from "@/components/guest/site-footer";
import { Clock, MapPin } from "lucide-react";

const venues = [
  {
    title: "Raya Restaurant",
    subtitle: "International Cuisine",
    hours: "6:00 AM – 10:30 PM",
    description:
      "Our signature restaurant serves an expansive breakfast buffet and à la carte dinner featuring dishes from around the world. Fresh, locally sourced ingredients prepared by our award-winning culinary team.",
    highlights: [
      "Live cooking stations",
      "Wine pairing available",
      "Private dining room",
    ],
  },
  {
    title: "Skyline Bar",
    subtitle: "Drinks & Cocktails",
    hours: "4:00 PM – 1:00 AM",
    description:
      "Perched on the rooftop with sweeping city views, Skyline Bar is the perfect spot for handcrafted cocktails, premium spirits, and light appetizers as the sun sets over the skyline.",
    highlights: [
      "Signature cocktail menu",
      "Rooftop terrace seating",
      "Live jazz on weekends",
    ],
  },
  {
    title: "Café Lounge",
    subtitle: "Light Bites & Coffee",
    hours: "7:00 AM – 9:00 PM",
    description:
      "A relaxed all-day café offering specialty coffees, freshly baked pastries, artisan sandwiches, and healthy light meals. Ideal for a quick break or casual meeting.",
    highlights: [
      "Specialty single-origin coffee",
      "Freshly baked pastries",
      "Grab-and-go options",
    ],
  },
];

export default function DiningPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Dining
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
            A Taste to Remember
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cream/60">
            Savor exquisite flavors crafted by our world-class chefs across
            three distinct dining experiences. From sunrise breakfasts to
            late-night cocktails, every meal is an occasion.
          </p>
        </div>
      </section>

      <section className="bg-charcoal pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12">
            {venues.map((venue, i) => (
              <div
                key={venue.title}
                className={`grid gap-8 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Image placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5 lg:[direction:ltr]">
                  {/* TODO: Replace with <Image src="/dining/..." alt={venue.title} fill className="object-cover" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-cream/20">
                    {venue.title} Image
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center lg:[direction:ltr]">
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                    {venue.subtitle}
                  </p>
                  <h2 className="mb-3 font-heading text-2xl font-light text-cream sm:text-3xl">
                    {venue.title}
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed text-cream/60">
                    {venue.description}
                  </p>

                  <div className="mb-5 flex items-center gap-2 text-xs text-cream/40">
                    <Clock className="size-3.5" />
                    {venue.hours}
                  </div>

                  <ul className="mb-6 flex flex-col gap-2">
                    {venue.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-sm text-cream/70"
                      >
                        <span className="size-1 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Location note */}
          <div className="mt-16 flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-5">
            <MapPin className="size-5 shrink-0 text-gold" />
            <p className="text-sm text-cream/50">
              All dining venues are located within the hotel. Reservations are
              recommended for dinner at Raya Restaurant. Room service is
              available 24/7.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
