import SiteFooter from "@/components/guest/site-footer";
import { FadeInView, StaggerContainer, StaggerItem, ImageReveal } from "@/components/motion/motion-components";

const images = [
  { alt: "Grand Raya Hotel lobby with marble floors and chandeliers", span: "sm:col-span-2 sm:row-span-2" },
  { alt: "Hotel exterior at dusk with illuminated facade", span: "" },
  { alt: "Infinity pool overlooking the city skyline", span: "" },
  { alt: "Deluxe room with king bed and panoramic windows", span: "" },
  { alt: "Raya Restaurant interior with warm ambient lighting", span: "" },
  { alt: "Spa treatment room with candles and towels", span: "sm:col-span-2" },
  { alt: "Skyline Bar rooftop terrace at sunset", span: "" },
  { alt: "Fitness center with modern equipment", span: "" },
  { alt: "Presidential Suite living area with city views", span: "sm:col-span-2" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — Gallery
            </p>
            <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
              Moments of Luxury
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-cream/60">
              A glimpse into the world of Grand Raya — where every corner is
              crafted to perfection and every detail tells a story.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="bg-charcoal pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3" stagger={0.08}>
            {images.map((img) => (
              <StaggerItem key={img.alt} className={img.span}>
                <ImageReveal>
                  <div className="group relative overflow-hidden rounded-xl bg-white/5">
                    <div className="aspect-[4/3] w-full">
                      {/* TODO: Replace with <Image src="/gallery/..." alt={img.alt} fill className="object-cover transition-transform group-hover:scale-105" /> */}
                      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-cream/20">
                        {img.alt}
                      </div>
                    </div>
                  </div>
                </ImageReveal>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
