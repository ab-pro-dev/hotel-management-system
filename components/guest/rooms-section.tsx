import { Button } from "@/components/ui/button";
import { Users, BedDouble, Maximize, ArrowLeft, ArrowRight } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Room",
    guests: 2,
    bed: "1 King Bed",
    size: "32m²",
    price: 120,
  },
  {
    name: "Executive Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "45m²",
    price: 180,
  },
  {
    name: "Premium Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "60m²",
    price: 350,
  },
  {
    name: "Presidential Suite",
    guests: 2,
    bed: "1 King Bed",
    size: "120m²",
    price: 450,
  },
];

export default function RoomsSection() {
  return (
    <section id="rooms" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              — Rooms & Suites
            </p>
            <h2 className="font-heading text-3xl font-light text-charcoal sm:text-4xl">
              Stay in Elegance & Comfort
            </h2>
            <div className="font-heading text-3xl font-light text-charcoal/10 sm:text-4xl">
              Stay in Elegance & Comfort
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal/60">
              Each room is thoughtfully designed to offer a blend of luxury and
              comfort, with stunning views and premium amenities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="shrink-0 border-gold/40 text-gold hover:bg-gold/10"
            >
              View All Rooms
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-charcoal/20 text-charcoal hover:bg-charcoal/5"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-charcoal/20 text-charcoal hover:bg-charcoal/5"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <div
              key={room.name}
              className="group overflow-hidden rounded-xl border border-charcoal/10 bg-white transition-shadow hover:shadow-lg"
            >
              {/* Placeholder image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/10">
                {/* TODO: Replace with <Image src="/rooms/..." alt={room.name} fill className="object-cover transition-transform group-hover:scale-105" /> */}
                <div className="absolute inset-0 flex items-center justify-center text-sm text-charcoal/30">
                  Room Image
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-3 font-heading text-lg font-medium text-charcoal">
                  {room.name}
                </h3>
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-charcoal/60">
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
  );
}
