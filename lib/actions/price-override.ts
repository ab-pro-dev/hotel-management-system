"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

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
  const user = await requireAdmin();
  const data = overrideSchema.parse(input);

  const dateOnly = new Date(data.date);
  dateOnly.setHours(0, 0, 0, 0);

  const override = await prisma.priceOverride.upsert({
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

  await logAudit({ userId: user.id, action: "SET_OVERRIDE", targetTable: "PriceOverride", targetId: override.id, metadata: { roomTypeId: data.roomTypeId, date: data.date, overridePrice: data.overridePrice } });
  return override;
}

export async function removePriceOverride(id: string) {
  const user = await requireAdmin();
  const override = await prisma.priceOverride.delete({ where: { id } });
  await logAudit({ userId: user.id, action: "REMOVE_OVERRIDE", targetTable: "PriceOverride", targetId: override.id, metadata: { roomTypeId: override.roomTypeId, date: override.date.toISOString() } });
  return override;
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
