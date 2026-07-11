import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const findBookingSchema = z.object({
  email: z.string().email("Valid email is required"),
  roomTypeTitle: z.string().min(1, "roomTypeTitle is required"),
});

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = findBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        guest: { email: parsed.data.email },
        room: { roomType: { title: parsed.data.roomTypeTitle } },
        status: "CONFIRMED",
      },
      orderBy: { checkInDate: "desc" },
      select: { id: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "No booking found" }, { status: 404 });
    }

    return NextResponse.json({ bookingId: booking.id });
  } catch (error) {
    console.error(`[test/find-booking] Failed to find booking:`, error);
    return NextResponse.json({ error: "Failed to search bookings" }, { status: 500 });
  }
}
