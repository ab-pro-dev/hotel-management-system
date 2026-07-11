"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { calculateRoomPrice } from "@/lib/pricing";
import { generateCheckInToken } from "./qr-checkin";
import { pusherServer } from "@/lib/pusher-server";
import { logAudit } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import { randomBytes } from "crypto";

const bookingSchema = z.object({
  roomTypeId: z.string().min(1, "Room type is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestName: z.string().min(1, "Guest name is required"),
  couponCode: z.string().optional(),
});

export async function createBooking(input: z.infer<typeof bookingSchema>) {
  const data = bookingSchema.parse(input);

  const checkInDate = new Date(data.checkInDate);
  const checkOutDate = new Date(data.checkOutDate);

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in date");
  }

  const result = await prisma.$transaction(async (tx) => {
    const roomType = await tx.roomType.findUnique({
      where: { id: data.roomTypeId },
    });
    if (!roomType) throw new Error("Room type not found");

    const availableRoom = await tx.room.findFirst({
      where: {
        roomTypeId: data.roomTypeId,
        status: "AVAILABLE",
        bookings: {
          none: {
            status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            checkInDate: { lt: checkOutDate },
            checkOutDate: { gt: checkInDate },
          },
        },
      },
    });

    if (!availableRoom) {
      return { waitlist: true, roomTypeId: data.roomTypeId, guestEmail: data.guestEmail, checkInDate, checkOutDate };
    }

    const guest = await tx.user.upsert({
      where: { email: data.guestEmail },
      update: { name: data.guestName },
      create: {
        email: data.guestEmail,
        name: data.guestName,
        passwordHash: "",
        role: Role.GUEST,
      },
    });

    let totalPrice = 0;
    const current = new Date(checkInDate);
    while (current < checkOutDate) {
      totalPrice += await calculateRoomPrice(
        Number(roomType.basePrice),
        current,
        data.roomTypeId
      );
      current.setDate(current.getDate() + 1);
    }
    totalPrice = Math.round(totalPrice * 100) / 100;

    let discountAmount = 0;
    if (data.couponCode) {
      const coupon = await tx.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });
      if (!coupon) throw new Error("Invalid coupon code");
      if (new Date() > coupon.expiresAt) throw new Error("This coupon has expired");
      if (coupon.usedCount >= coupon.maxUses) throw new Error("This coupon has reached its usage limit");

      if (coupon.discountType === "PERCENT") {
        discountAmount = (totalPrice * Number(coupon.discountValue)) / 100;
      } else {
        discountAmount = Math.min(Number(coupon.discountValue), totalPrice);
      }
      discountAmount = Math.round(discountAmount * 100) / 100;
      totalPrice = Math.round((totalPrice - discountAmount) * 100) / 100;

      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const booking = await tx.booking.create({
      data: {
        guestId: guest.id,
        roomId: availableRoom.id,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: totalPrice,
        paymentMethod: "card",
        status: "PAID",
        transactionId: `txn_${randomBytes(12).toString("hex")}`,
      },
    });

    return booking;
  });

  if (result && "waitlist" in result) {
    return result;
  }

  await generateCheckInToken(result.id);

  const accessToken = randomBytes(32).toString("hex");
  await prisma.booking.update({
    where: { id: result.id },
    data: { bookingAccessToken: accessToken },
  });

  const guestId = result.guestId;
  const bookingWithRoom = await prisma.booking.findUnique({
    where: { id: result.id },
    include: { room: { include: { roomType: true } } },
  });

  if (bookingWithRoom) {
    await createNotification(
      guestId,
      `Booking confirmed! Room ${bookingWithRoom.room.roomNumber} (${bookingWithRoom.room.roomType.title}) — check-in ${new Date(bookingWithRoom.checkInDate).toLocaleDateString()}.`
    );
  }

  return { ...result, bookingAccessToken: accessToken };
}

export async function cancelBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.guestId !== session.user.id) throw new Error("Unauthorized");
  if (booking.status !== "CONFIRMED") {
    throw new Error("Only CONFIRMED bookings can be cancelled");
  }

  await logAudit({ userId: session.user.id, action: "CANCEL", targetTable: "Booking", targetId: booking.id, metadata: { totalPrice: Number(booking.totalPrice), roomId: booking.roomId } });

  const now = new Date();
  const checkIn = new Date(booking.checkInDate);
  const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isWithin48Hours = hoursUntilCheckIn <= 48;

  const refundAmount = isWithin48Hours
    ? Math.round(Number(booking.totalPrice) * 0.5 * 100) / 100
    : Number(booking.totalPrice);

  const result = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    if (booking.payment) {
      await tx.payment.update({
        where: { id: booking.payment.id },
        data: {
          status: "REFUNDED",
          amount: refundAmount,
        },
      });
    }

    return { updatedBooking, refundAmount, isWithin48Hours };
  });

  const matchingRoom = await prisma.room.findUnique({
    where: { id: booking.roomId },
    select: { roomTypeId: true },
  });

  if (matchingRoom) {
    const waitlistEntries = await prisma.waitlist.findMany({
      where: {
        roomTypeId: matchingRoom.roomTypeId,
        notified: false,
        requestedCheckIn: { lte: booking.checkOutDate },
        requestedCheckOut: { gte: booking.checkInDate },
      },
    });

    for (const entry of waitlistEntries) {
      await pusherServer.trigger("waitlist", "room-available", {
        guestEmail: entry.guestEmail,
        roomTypeId: matchingRoom.roomTypeId,
        requestedCheckIn: entry.requestedCheckIn.toISOString(),
        requestedCheckOut: entry.requestedCheckOut.toISOString(),
      });

      await prisma.waitlist.update({
        where: { id: entry.id },
        data: { notified: true },
      });
    }
  }

  await createNotification(
    booking.guestId,
    `Your booking has been cancelled. ${result.isWithin48Hours ? "A 50% cancellation fee was applied." : "A full refund has been issued."}`
  );

  return result;
}
