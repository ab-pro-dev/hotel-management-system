import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const checkoutSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
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

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: parsed.data.bookingId },
      data: { status: "CHECKED_OUT" },
    });

    return NextResponse.json({ ok: true, id: booking.id, status: booking.status });
  } catch (error) {
    console.error(`[test/checkout-booking] Failed to checkout booking ${parsed.data.bookingId}:`, error);
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
