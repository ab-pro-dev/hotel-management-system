"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

const bookingSchema = z.object({
  roomTypeId: z.string().min(1, "Room type is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestName: z.string().min(1, "Guest name is required"),
});

function generateCheckInToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createBooking(input: z.infer<typeof bookingSchema>) {
  const data = bookingSchema.parse(input);

  const checkInDate = new Date(data.checkInDate);
  const checkOutDate = new Date(data.checkOutDate);

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in date");
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

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
      throw new Error("No rooms available for the selected dates");
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

    const totalPrice = nights * Number(roomType.basePrice);
    const checkInToken = generateCheckInToken();

    const booking = await tx.booking.create({
      data: {
        guestId: guest.id,
        roomId: availableRoom.id,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "CONFIRMED",
        checkInToken,
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

  return result;
}
