"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

const couponInputSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  bookingTotal: z.number().positive("Booking total must be positive"),
});

export type CouponResult = {
  code: string;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  discountAmount: number;
  finalTotal: number;
};

export async function applyCoupon(
  input: z.infer<typeof couponInputSchema>
): Promise<CouponResult> {
  const { code, bookingTotal } = couponInputSchema.parse(input);

  let coupon;
  try {
    coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  } catch (error) {
    console.error(`[applyCoupon] Failed to look up coupon "${code}":`, error);
    throw new Error("Failed to validate coupon. Please try again.");
  }

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (new Date() > coupon.expiresAt) {
    throw new Error("This coupon has expired");
  }

  if (coupon.usedCount >= coupon.maxUses) {
    throw new Error("This coupon has reached its usage limit");
  }

  let discountAmount: number;
  if (coupon.discountType === "PERCENT") {
    discountAmount = (bookingTotal * Number(coupon.discountValue)) / 100;
  } else {
    discountAmount = Math.min(Number(coupon.discountValue), bookingTotal);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalTotal = Math.round((bookingTotal - discountAmount) * 100) / 100;

  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    discountAmount,
    finalTotal,
  };
}
