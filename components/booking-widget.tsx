"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { CalendarDays, Users } from "lucide-react";

export default function BookingWidget() {
  const router = useRouter();

  // Default check-in to tomorrow, check-out to day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [guests, setGuests] = useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 1) params.set("capacity", String(guests));
    router.push(`/rooms?${params.toString()}`);
  }

  // Ensure check-out is always after check-in
  function handleCheckInChange(val: string) {
    setCheckIn(val);
    if (checkOut <= val) {
      const next = new Date(val);
      next.setDate(next.getDate() + 1);
      setCheckOut(fmt(next));
    }
  }

  const today = fmt(new Date());

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 w-full max-w-3xl"
    >
      <div
        className="flex flex-col gap-0 sm:flex-row"
        style={{ backgroundColor: "rgba(20,16,12,0.55)", backdropFilter: "blur(12px)" }}
      >
        {/* Check-in */}
        <label className="group flex flex-1 flex-col gap-1 border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
          <span
            className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(235,225,210,0.5)" }}
          >
            <CalendarDays className="h-3 w-3" />
            Check-in
          </span>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => handleCheckInChange(e.target.value)}
            required
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{
              color: "rgba(245,240,230,0.9)",
              colorScheme: "dark",
            }}
          />
        </label>

        {/* Check-out */}
        <label className="group flex flex-1 flex-col gap-1 border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
          <span
            className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(235,225,210,0.5)" }}
          >
            <CalendarDays className="h-3 w-3" />
            Check-out
          </span>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{
              color: "rgba(245,240,230,0.9)",
              colorScheme: "dark",
            }}
          />
        </label>

        {/* Guests */}
        <label className="group flex flex-1 flex-col gap-1 border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
          <span
            className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(235,225,210,0.5)" }}
          >
            <Users className="h-3 w-3" />
            Guests
          </span>
          <input
            type="number"
            value={guests}
            min={1}
            max={10}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-transparent text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ color: "rgba(245,240,230,0.9)" }}
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="bg-primary px-8 py-4 text-xs tracking-[0.25em] uppercase text-primary-foreground transition-all duration-300 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Check Availability
        </button>
      </div>
    </form>
  );
}
