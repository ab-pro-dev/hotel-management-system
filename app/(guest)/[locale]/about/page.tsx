import SiteFooter from "@/components/guest/site-footer";
import { Target, Eye, Heart, Award, Users, Clock } from "lucide-react";

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

const stats = [
  { icon: Award, value: "25+", label: "Years of Excellence" },
  { icon: Users, value: "50,000+", label: "Guests Hosted Annually" },
  { icon: Clock, value: "24/7", label: "Dedicated Service" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — About Us
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
            The Grand Raya Experience
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cream/60">
            A legacy of luxury, a promise of perfection.
          </p>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-heading text-3xl font-light text-charcoal sm:text-4xl">
                Our Story
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-charcoal/60">
                <p>
                  Nestled in the heart of the city, Grand Raya Hotel has been a
                  beacon of luxury and warm hospitality since 1998. What began as
                  a vision to create a home away from home has grown into one of
                  the region&apos;s most celebrated hotel experiences.
                </p>
                <p>
                  Our commitment to excellence is reflected in every detail —
                  from our elegantly appointed rooms and world-class dining to
                  our rejuvenating spa and attentive concierge service. Every
                  element is thoughtfully curated to ensure your stay exceeds
                  expectations.
                </p>
                <p>
                  Whether you&apos;re here for business, celebration, or simply
                  to escape the ordinary, Grand Raya Hotel offers an experience
                  that blends timeless elegance with modern comfort.
                </p>
              </div>
            </div>

            {/* Placeholder image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal/10 lg:aspect-square">
              {/* TODO: Replace with <Image src="/about.jpg" alt="Grand Raya Hotel" fill className="object-cover" /> */}
              <div className="absolute inset-0 flex items-center justify-center text-sm text-charcoal/30">
                Hotel Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <stat.icon className="size-5 text-gold" />
                </div>
                <p className="font-heading text-3xl font-light text-cream">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-cream/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-heading text-3xl font-light text-charcoal sm:text-4xl">
            What We Stand For
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <item.icon className="size-5 text-gold" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
