"use server";

import { z } from "zod";
import { Role, RoomStatus } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const roomCreateSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
});

const roomStatusSchema = z.object({
  status: z.nativeEnum(RoomStatus),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: ADMIN role required");
  }
  return session.user;
}

export async function createRoom(data: z.infer<typeof roomCreateSchema>) {
  await requireAdmin();
  const parsed = roomCreateSchema.parse(data);
  return prisma.room.create({ data: parsed });
}

export async function listRooms(propertyId?: string) {
  return prisma.room.findMany({
    where: propertyId
      ? { roomType: { propertyId } }
      : undefined,
    include: { roomType: true },
  });
}

export async function updateRoomStatus(
  id: string,
  data: z.infer<typeof roomStatusSchema>
) {
  await requireAdmin();
  const parsed = roomStatusSchema.parse(data);
  return prisma.room.update({ where: { id }, data: parsed });
}
