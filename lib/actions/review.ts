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

export async function listReviews() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: ADMIN role required");
  }

  try {
    return await prisma.review.findMany({
      include: {
        booking: {
          include: {
            guest: { select: { name: true, email: true } },
            room: { select: { roomNumber: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[listReviews] Failed to list reviews:", error);
    throw new Error("Failed to load reviews.");
  }
}

export async function hideReview(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: ADMIN role required");
  }

  try {
    return await prisma.review.update({
      where: { id },
      data: { hidden: true },
    });
  } catch (error) {
    console.error(`[hideReview] Failed to hide review ${id}:`, error);
    throw new Error("Failed to hide review.");
  }
}

export async function unhideReview(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: ADMIN role required");
  }

  try {
    return await prisma.review.update({
      where: { id },
      data: { hidden: false },
    });
  } catch (error) {
    console.error(`[unhideReview] Failed to unhide review ${id}:`, error);
    throw new Error("Failed to unhide review.");
  }
}

export async function deleteReview(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: ADMIN role required");
  }

  try {
    await prisma.review.delete({ where: { id } });
  } catch (error) {
    console.error(`[deleteReview] Failed to delete review ${id}:`, error);
    throw new Error("Failed to delete review.");
  }
}
