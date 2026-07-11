"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

const overrideSchema = z.object({
  roomTypeId: z.string().min(1, "Room type is required"),
  date: z.string().min(1, "Date is required"),
  overridePrice: z.number().positive("Price must be positive"),
});

export async function setPriceOverride(input: z.infer<typeof overrideSchema>) {
  await requireAdmin();
  const data = overrideSchema.parse(input);

  const dateOnly = new Date(data.date);
  dateOnly.setHours(0, 0, 0, 0);

  return prisma.priceOverride.upsert({
    where: {
      roomTypeId_date: {
        roomTypeId: data.roomTypeId,
        date: dateOnly,
      },
    },
    update: { overridePrice: data.overridePrice },
    create: {
      roomTypeId: data.roomTypeId,
      date: dateOnly,
      overridePrice: data.overridePrice,
    },
  });
}

export async function removePriceOverride(id: string) {
  await requireAdmin();
  return prisma.priceOverride.delete({ where: { id } });
}

export async function listPriceOverrides(roomTypeId: string) {
  await requireAdmin();
  return prisma.priceOverride.findMany({
    where: {
      roomTypeId,
      date: { gte: new Date() },
    },
    orderBy: { date: "asc" },
  });
}
