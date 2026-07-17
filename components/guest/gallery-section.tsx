import { Button } from "@/components/ui/button";

const images = [
  { alt: "Hotel Lobby" },
  { alt: "Building Exterior" },
  { alt: "Swimming Pool" },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Gallery
          </p>
          <h2 className="mb-3 font-heading text-3xl font-light text-charcoal sm:text-4xl">
            Moments of Luxury
          </h2>
          <p className="mb-6 max-w-lg text-sm leading-relaxed text-charcoal/60">
            A glimpse into the world of Grand Raya — where every moment is
            crafted to perfection.
          </p>
          <Button
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            View Full Gallery
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.alt}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal/10"
            >
              {/* TODO: Replace with <Image src="/gallery/..." alt={img.alt} fill className="object-cover transition-transform group-hover:scale-105" /> */}
              <div className="absolute inset-0 flex items-center justify-center text-sm text-charcoal/30">
                {img.alt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
