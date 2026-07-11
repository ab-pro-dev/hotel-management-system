import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Test-only endpoint to transition a booking to CHECKED_OUT so we can
 * verify the "Download Bill" button in e2e tests.
 *
 * POST /api/test/checkout-booking  { bookingId: string }
 *
 * This endpoint should be removed or gated behind NODE_ENV === "development"
 * before deploying to production.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { bookingId } = await req.json();
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CHECKED_OUT" },
  });

  return NextResponse.json({ ok: true, id: booking.id, status: booking.status });
}
