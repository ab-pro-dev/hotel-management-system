"use server";

import { z } from "zod";
import { Role, RoomStatus } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

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
  const user = await requireAdmin();
  const parsed = roomCreateSchema.parse(data);

  try {
    const room = await prisma.room.create({ data: parsed });
    await logAudit({ userId: user.id, action: "CREATE", targetTable: "Room", targetId: room.id, metadata: { roomNumber: room.roomNumber, roomTypeId: room.roomTypeId } });
    return room;
  } catch (error) {
    console.error(`[createRoom] Failed to create room ${parsed.roomNumber}:`, error);
    throw new Error("Failed to create room. Please try again.");
  }
}

export async function listRooms(propertyId?: string) {
  try {
    return await prisma.room.findMany({
      where: propertyId
        ? { roomType: { propertyId } }
        : undefined,
      include: { roomType: true },
    });
  } catch (error) {
    console.error(`[listRooms] Failed to list rooms:`, error);
    throw new Error("Failed to load rooms. Please try again.");
  }
}

export async function updateRoomStatus(
  id: string,
  data: z.infer<typeof roomStatusSchema>
) {
  const user = await requireAdmin();
  const parsed = roomStatusSchema.parse(data);

  try {
    const room = await prisma.room.update({ where: { id }, data: parsed });
    await logAudit({ userId: user.id, action: "UPDATE_STATUS", targetTable: "Room", targetId: room.id, metadata: { status: room.status } });
    return room;
  } catch (error) {
    console.error(`[updateRoomStatus] Failed to update room ${id}:`, error);
    throw new Error("Failed to update room status. Please try again.");
  }
}
