"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const roomTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().positive("Base price must be positive"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  propertyId: z.string().min(1, "Property is required"),
});

const roomTypeUpdateSchema = roomTypeSchema.partial();

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

export async function createRoomType(data: z.infer<typeof roomTypeSchema>) {
  await requireAdmin();
  const parsed = roomTypeSchema.parse(data);
  return prisma.roomType.create({ data: parsed });
}

export async function listRoomTypes(propertyId?: string) {
  return prisma.roomType.findMany({
    where: propertyId ? { propertyId } : undefined,
    include: { rooms: true },
  });
}

export async function updateRoomType(
  id: string,
  data: z.infer<typeof roomTypeUpdateSchema>
) {
  await requireAdmin();
  const parsed = roomTypeUpdateSchema.parse(data);
  return prisma.roomType.update({ where: { id }, data: parsed });
}

export async function deleteRoomType(id: string) {
  await requireAdmin();
  return prisma.roomType.delete({ where: { id } });
}
