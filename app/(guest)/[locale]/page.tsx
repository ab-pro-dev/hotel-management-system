import Link from "next/link";
import HeroSection from "@/components/guest/hero-section";
import SiteFooter from "@/components/guest/site-footer";
import { ArrowRight, Utensils, Grid3X3, BedDouble } from "lucide-react";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/motion/motion-components";

const teasers = [
  {
    icon: BedDouble,
    title: "Rooms & Suites",
    description:
      "From elegant rooms to presidential suites — find your perfect stay.",
    href: "/rooms",
  },
  {
    icon: Grid3X3,
    title: "Amenities",
    description:
      "Pool, spa, fitness center, and more — everything you need on-site.",
    href: "/amenities",
  },
  {
    icon: Utensils,
    title: "Dining",
    description:
      "Three distinct venues serving world-class cuisine around the clock.",
    href: "/dining",
  },
];

export default function GuestHomePage() {
  return (
    <>
      <HeroSection />

      {/* Teaser row */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — Discover
            </p>
            <h2 className="font-heading text-3xl font-light text-charcoal sm:text-4xl">
              Explore Grand Raya
            </h2>
          </FadeInView>

          <StaggerContainer className="grid gap-6 sm:grid-cols-3" stagger={0.12}>
            {teasers.map((item) => (
              <StaggerItem key={item.title}>
                <Link href={item.href} className="group block">
                  <div className="rounded-2xl border border-charcoal/10 bg-white p-8 transition-all group-hover:border-gold/30 group-hover:shadow-lg">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                      <item.icon className="size-6 text-gold" />
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-medium text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-charcoal/50">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors group-hover:gap-2.5">
                      Learn More <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView delay={0.3} className="mt-12 text-center">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              View All Rooms
              <ArrowRight className="size-4" />
            </Link>
          </FadeInView>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
