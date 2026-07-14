"use server";

import { z } from "zod";
import { randomBytes } from "crypto";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

const bookingIdSchema = z.string().min(1, "Booking ID is required");
const tokenSchema = z.string().min(1, "Token is required");

export async function generateCheckInToken(bookingId: string): Promise<string> {
  const validBookingId = bookingIdSchema.parse(bookingId);

  const booking = await prisma.booking.findUnique({ where: { id: validBookingId } });
  if (!booking) throw new Error("Booking not found");

  const token = randomBytes(32).toString("hex");

  try {
    await prisma.booking.update({
      where: { id: validBookingId },
      data: { checkInToken: token },
    });
    return token;
  } catch (error) {
    console.error(`[generateCheckInToken] Failed to generate token for booking ${validBookingId}:`, error);
    throw new Error("Failed to generate check-in token. Please try again.");
  }
}

export async function verifyAndCheckIn(token: string) {
  const validToken = tokenSchema.parse(token);
  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: RECEPTIONIST or ADMIN role required");
  }

  const booking = await prisma.booking.findUnique({
    where: { checkInToken: validToken },
    include: { room: true },
  });

  if (!booking) throw new Error("Invalid or expired check-in token");
  if (booking.status !== "CONFIRMED") {
    throw new Error("Booking is not in CONFIRMED status");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(booking.checkInDate) > today) {
    throw new Error("Check-in date has not arrived yet");
  }

  try {
    const [updatedBooking, updatedRoom] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CHECKED_IN", checkInToken: null },
      }),
      prisma.room.update({
        where: { id: booking.roomId },
        data: { status: "OCCUPIED" },
      }),
    ]);

    await pusherServer.trigger("rooms", "room-status-changed", {
      roomId: updatedRoom.id,
      status: updatedRoom.status,
    });

    return updatedBooking;
  } catch (error) {
    console.error(`[verifyAndCheckIn] Failed to check in booking with token ${validToken.slice(0, 8)}...:`, error);
    throw new Error("Failed to complete check-in. Please try again.");
  }
}
