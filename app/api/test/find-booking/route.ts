import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Test-only endpoint to find a user's most recent confirmed booking
 * for a given room type.
 *
 * POST /api/test/find-booking  { email: string, roomTypeTitle: string }
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { email, roomTypeTitle } = await req.json();

  const booking = await prisma.booking.findFirst({
    where: {
      guest: { email },
      room: { roomType: { title: roomTypeTitle } },
      status: "CONFIRMED",
    },
    orderBy: { checkInDate: "desc" },
    select: { id: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "No booking found" }, { status: 404 });
  }

  return NextResponse.json({ bookingId: booking.id });
}
