"use server";

import { z } from "zod";
import { RoomStatus } from "@prisma/client";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

const roomIdSchema = z.string().min(1, "Room ID is required");

const STATUS_CYCLE: Record<string, RoomStatus> = {
  DIRTY: "IN_PROGRESS",
  IN_PROGRESS: "AVAILABLE",
};

async function requireHousekeeperOrAdmin() {
  const session = await auth();
  if (!session?.user || !["HOUSEKEEPER", "ADMIN"].includes(session.user.role)) {
    throw new Error("Unauthorized: HOUSEKEEPER or ADMIN role required");
  }
  return session.user;
}

export async function cycleRoomStatus(roomId: string) {
  const validRoomId = roomIdSchema.parse(roomId);
  await requireHousekeeperOrAdmin();

  const room = await prisma.room.findUnique({ where: { id: validRoomId } });
  if (!room) throw new Error("Room not found");

  const nextStatus = STATUS_CYCLE[room.status];
  if (!nextStatus) {
    throw new Error(`Room cannot be cycled from status: ${room.status}`);
  }

  try {
    const updatedRoom = await prisma.room.update({
      where: { id: validRoomId },
      data: { status: nextStatus },
    });

    await pusherServer.trigger("rooms", "room-status-changed", {
      roomId: updatedRoom.id,
      status: updatedRoom.status,
    });

    return updatedRoom;
  } catch (error) {
    console.error(`[cycleRoomStatus] Failed to update room ${validRoomId}:`, error);
    throw new Error("Failed to update room status. Please try again.");
  }
}
