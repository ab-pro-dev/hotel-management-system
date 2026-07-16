"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const couponInputSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  bookingTotal: z.number().positive("Booking total must be positive"),
});

const couponCreateSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(20),
  discountType: z.enum(["PERCENT", "FLAT"]),
  discountValue: z.number().positive("Discount value must be positive"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  maxUses: z.number().int().min(1, "Max uses must be at least 1"),
});

const couponUpdateSchema = couponCreateSchema.partial();

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

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

export async function createCoupon(data: z.infer<typeof couponCreateSchema>) {
  const user = await requireAdmin();
  const parsed = couponCreateSchema.parse(data);

  const existing = await prisma.coupon.findUnique({ where: { code: parsed.code.toUpperCase() } });
  if (existing) {
    throw new Error("A coupon with this code already exists.");
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.code.toUpperCase(),
        discountType: parsed.discountType,
        discountValue: parsed.discountValue,
        expiresAt: new Date(parsed.expiresAt),
        maxUses: parsed.maxUses,
      },
    });
    await logAudit({ userId: user.id, action: "CREATE", targetTable: "Coupon", targetId: coupon.id, metadata: { code: coupon.code, discountType: coupon.discountType } });
    return coupon;
  } catch (error) {
    console.error(`[createCoupon] Failed to create coupon:`, error);
    throw new Error("Failed to create coupon. Please try again.");
  }
}

export async function updateCoupon(id: string, data: z.infer<typeof couponUpdateSchema>) {
  const user = await requireAdmin();
  const parsed = couponUpdateSchema.parse(data);

  try {
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...parsed,
        code: parsed.code?.toUpperCase(),
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
      },
    });
    await logAudit({ userId: user.id, action: "UPDATE", targetTable: "Coupon", targetId: coupon.id, metadata: { code: coupon.code } });
    return coupon;
  } catch (error) {
    console.error(`[updateCoupon] Failed to update coupon ${id}:`, error);
    throw new Error("Failed to update coupon. Please try again.");
  }
}

const deleteCouponSchema = z.string().min(1, "Coupon ID is required");

export async function deleteCoupon(id: string) {
  const user = await requireAdmin();
  const validId = deleteCouponSchema.parse(id);

  try {
    const coupon = await prisma.coupon.delete({ where: { id: validId } });
    await logAudit({ userId: user.id, action: "DELETE", targetTable: "Coupon", targetId: coupon.id, metadata: { code: coupon.code } });
    return coupon;
  } catch (error) {
    console.error(`[deleteCoupon] Failed to delete coupon ${validId}:`, error);
    throw new Error("Failed to delete coupon. Please try again.");
  }
}
