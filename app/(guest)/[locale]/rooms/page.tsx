import SiteFooter from "@/components/guest/site-footer";
import { Users, BedDouble, Maximize } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Room",
    guests: 2,
    bed: "1 King Bed",
    size: "32m²",
    price: 120,
    description:
      "Elegantly appointed room with city views, plush bedding, and a marble bathroom. Perfect for solo travelers or couples.",
  },
  {
    name: "Executive Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "45m²",
    price: 180,
    description:
      "Spacious suite with a separate living area, work desk, and panoramic windows. Ideal for business travelers.",
  },
  {
    name: "Premium Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "60m²",
    price: 350,
    description:
      "Luxurious suite with a private lounge, dining area, and premium amenities. Floor-to-ceiling windows with stunning views.",
  },
  {
    name: "Presidential Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "120m²",
    price: 450,
    description:
      "Our finest accommodation featuring a grand living room, private kitchen, jacuzzi tub, and dedicated butler service.",
  },
];

export default function RoomsPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Rooms & Suites
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
            Stay in Elegance & Comfort
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cream/60">
            Each room is thoughtfully designed to offer a blend of luxury and
            comfort, with stunning views and premium amenities.
          </p>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {rooms.map((room) => (
              <div
                key={room.name}
                className="group overflow-hidden rounded-xl border border-charcoal/10 bg-white transition-shadow hover:shadow-lg"
              >
                {/* Placeholder image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-charcoal/10">
                  {/* TODO: Replace with <Image src="/rooms/..." alt={room.name} fill className="object-cover transition-transform group-hover:scale-105" /> */}
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-charcoal/30">
                    {room.name} Image
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="mb-2 font-heading text-xl font-medium text-charcoal">
                    {room.name}
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-charcoal/50">
                    {room.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-charcoal/60">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      {room.guests} Guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="size-3.5" />
                      {room.bed}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="size-3.5" />
                      {room.size}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gold">
                    From ${room.price}{" "}
                    <span className="font-normal text-charcoal/50">/ night</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
