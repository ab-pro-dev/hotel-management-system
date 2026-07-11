"use server";

import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const reviewSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.number().int().min(1, "Rating is required").max(5, "Rating must be 1-5"),
  comment: z.string().min(1, "Comment is required").max(500, "Comment must be 500 characters or less"),
});

export async function submitReview(input: z.infer<typeof reviewSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to submit a review");
  }

  const data = reviewSchema.parse(input);

  const booking = await prisma.booking.findFirst({
    where: {
      id: data.bookingId,
      guestId: session.user.id,
      status: "CHECKED_OUT",
    },
  });

  if (!booking) {
    throw new Error("Booking not found or not eligible for review");
  }

  const existing = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });

  if (existing) {
    throw new Error("You have already reviewed this booking");
  }

  try {
    return await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  } catch (error) {
    console.error(`[submitReview] Failed to submit review for booking ${data.bookingId}:`, error);
    throw new Error("Failed to submit review. Please try again.");
  }
}
