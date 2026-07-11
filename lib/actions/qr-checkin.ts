"use server";

import { randomBytes } from "crypto";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function generateCheckInToken(bookingId: string): Promise<string> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  const token = randomBytes(32).toString("hex");

  await prisma.booking.update({
    where: { id: bookingId },
    data: { checkInToken: token },
  });

  return token;
}

export async function verifyAndCheckIn(token: string) {
  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: RECEPTIONIST or ADMIN role required");
  }

  const booking = await prisma.booking.findUnique({
    where: { checkInToken: token },
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
}
