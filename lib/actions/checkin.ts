"use server";

import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

async function requireReceptionistOrAdmin() {
  const session = await auth();
  if (!session?.user || !["RECEPTIONIST", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: RECEPTIONIST or ADMIN role required");
  }
  return session.user;
}

export async function checkInGuest(bookingId: string) {
  await requireReceptionistOrAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "CONFIRMED") {
    throw new Error("Booking must be CONFIRMED to check in");
  }

  const [updatedBooking, updatedRoom] = await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CHECKED_IN" },
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

export async function checkOutGuest(bookingId: string) {
  await requireReceptionistOrAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "CHECKED_IN") {
    throw new Error("Booking must be CHECKED_IN to check out");
  }

  const pointsEarned = Math.floor(Number(booking.totalPrice));

  const result = await prisma.$transaction(async (tx) => {
    const [updatedBooking, updatedRoom] = await Promise.all([
      tx.booking.update({
        where: { id: bookingId },
        data: { status: "CHECKED_OUT" },
      }),
      tx.room.update({
        where: { id: booking.roomId },
        data: { status: "DIRTY" },
      }),
    ]);

    const guest = await tx.user.findUnique({ where: { id: booking.guestId } });
    if (guest) {
      const newPoints = guest.loyaltyPoints + pointsEarned;
      let newTier = guest.loyaltyTier;
      if (newPoints >= 10000) newTier = "GOLD";
      else if (newPoints >= 3000) newTier = "SILVER";

      await tx.user.update({
        where: { id: guest.id },
        data: { loyaltyPoints: newPoints, loyaltyTier: newTier },
      });
    }

    return { updatedBooking, updatedRoom, pointsEarned };
  });

  await pusherServer.trigger("rooms", "room-status-changed", {
    roomId: result.updatedRoom.id,
    status: result.updatedRoom.status,
  });

  return result.updatedBooking;
}
