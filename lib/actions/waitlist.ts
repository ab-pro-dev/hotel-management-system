"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

const waitlistSchema = z.object({
  guestEmail: z.string().email("Valid email is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  requestedCheckIn: z.string().min(1, "Check-in date is required"),
  requestedCheckOut: z.string().min(1, "Check-out date is required"),
});

export async function joinWaitlist(input: z.infer<typeof waitlistSchema>) {
  const data = waitlistSchema.parse(input);

  const roomType = await prisma.roomType.findUnique({
    where: { id: data.roomTypeId },
  });
  if (!roomType) throw new Error("Room type not found");

  const existing = await prisma.waitlist.findFirst({
    where: {
      guestEmail: data.guestEmail,
      roomTypeId: data.roomTypeId,
      requestedCheckIn: new Date(data.requestedCheckIn),
      requestedCheckOut: new Date(data.requestedCheckOut),
      notified: false,
    },
  });

  if (existing) {
    throw new Error("You are already on the waitlist for these dates");
  }

  try {
    return await prisma.waitlist.create({
      data: {
        guestEmail: data.guestEmail,
        roomTypeId: data.roomTypeId,
        requestedCheckIn: new Date(data.requestedCheckIn),
        requestedCheckOut: new Date(data.requestedCheckOut),
      },
    });
  } catch (error) {
    console.error(`[joinWaitlist] Failed to join waitlist for ${data.guestEmail}:`, error);
    throw new Error("Failed to join waitlist. Please try again.");
  }
}
