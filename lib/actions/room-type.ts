"use server";

import { z } from "zod";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

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
  const user = await requireAdmin();
  const parsed = roomTypeSchema.parse(data);

  try {
    const roomType = await prisma.roomType.create({ data: parsed });
    await logAudit({ userId: user.id, action: "CREATE", targetTable: "RoomType", targetId: roomType.id, metadata: { title: roomType.title, basePrice: Number(roomType.basePrice) } });
    return roomType;
  } catch (error) {
    console.error(`[createRoomType] Failed to create room type:`, error);
    throw new Error("Failed to create room type. Please try again.");
  }
}

export async function listRoomTypes(propertyId?: string) {
  try {
    return await prisma.roomType.findMany({
      where: propertyId ? { propertyId } : undefined,
      include: { rooms: true },
    });
  } catch (error) {
    console.error(`[listRoomTypes] Failed to list room types:`, error);
    throw new Error("Failed to load room types. Please try again.");
  }
}

export async function updateRoomType(
  id: string,
  data: z.infer<typeof roomTypeUpdateSchema>
) {
  const user = await requireAdmin();
  const parsed = roomTypeUpdateSchema.parse(data);

  try {
    const roomType = await prisma.roomType.update({ where: { id }, data: parsed });
    await logAudit({ userId: user.id, action: "UPDATE", targetTable: "RoomType", targetId: roomType.id, metadata: parsed });
    return roomType;
  } catch (error) {
    console.error(`[updateRoomType] Failed to update room type ${id}:`, error);
    throw new Error("Failed to update room type. Please try again.");
  }
}

const deleteRoomTypeSchema = z.string().min(1, "Room type ID is required");

export async function deleteRoomType(id: string) {
  const user = await requireAdmin();
  const validId = deleteRoomTypeSchema.parse(id);

  try {
    const roomType = await prisma.roomType.delete({ where: { id: validId } });
    await logAudit({ userId: user.id, action: "DELETE", targetTable: "RoomType", targetId: roomType.id, metadata: { title: roomType.title } });
    return roomType;
  } catch (error) {
    console.error(`[deleteRoomType] Failed to delete room type ${validId}:`, error);
    throw new Error("Failed to delete room type. Please try again.");
  }
}
