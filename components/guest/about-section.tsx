import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To deliver unmatched hospitality and comfort.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "To be the leading luxury hotel in the region.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Integrity, Excellence, and Guest Satisfaction.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — About Us
            </p>
            <h2 className="mb-4 font-heading text-3xl font-light text-charcoal sm:text-4xl">
              The Grand Raya Experience
            </h2>
            <p className="mb-8 max-w-lg text-sm leading-relaxed text-charcoal/60">
              Nestled in the heart of the city, Grand Raya Hotel has been a
              beacon of luxury and warm hospitality since 1998. Our commitment to
              excellence is reflected in every detail, from our elegantly
              appointed rooms to our world-class dining and wellness facilities.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((item) => (
                <div key={item.title}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <item.icon className="size-5 text-gold" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-charcoal/50">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal/10 lg:aspect-square">
            {/* TODO: Replace with <Image src="/about.jpg" alt="Grand Raya Hotel" fill className="object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center text-sm text-charcoal/30">
              About Image
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
