import { Button } from "@/components/ui/button";

const venues = [
  {
    title: "Raya Restaurant",
    subtitle: "International Cuisine",
  },
  {
    title: "Skyline Bar",
    subtitle: "Drinks & Cocktails",
  },
  {
    title: "Café Lounge",
    subtitle: "Light Bites & Coffee",
  },
];

export default function DiningSection() {
  return (
    <section id="dining" className="bg-charcoal py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Dining
          </p>
          <h2 className="mb-3 font-heading text-3xl font-light text-cream sm:text-4xl">
            A Taste to Remember
          </h2>
          <p className="mb-6 max-w-lg text-sm leading-relaxed text-cream/60">
            Savor exquisite flavors crafted by our world-class chefs across
            three distinct dining experiences.
          </p>
          <Button
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            View All Menus
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.title}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              {/* Placeholder image */}
              {/* TODO: Replace with <Image src="/dining/..." alt={venue.title} fill className="object-cover transition-transform group-hover:scale-105" /> */}
              <div className="absolute inset-0 bg-charcoal/60 transition-colors group-hover:bg-charcoal/40" />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-cream/20">
                {venue.title} Image
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl font-medium text-cream">
                  {venue.title}
                </h3>
                <p className="mt-1 text-sm text-cream/60">{venue.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
