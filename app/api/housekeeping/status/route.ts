"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

const STATUS_CYCLE: Record<string, string> = {
  DIRTY: "IN_PROGRESS",
  IN_PROGRESS: "AVAILABLE",
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !["HOUSEKEEPER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { roomId, status } = body;

  if (!roomId || !status) {
    return NextResponse.json({ error: "roomId and status required" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (STATUS_CYCLE[room.status] !== status) {
    return NextResponse.json(
      { error: `Invalid status transition from ${room.status}` },
      { status: 400 }
    );
  }

  const updated = await prisma.room.update({
    where: { id: roomId },
    data: { status: status as any },
  });

  await pusherServer.trigger("rooms", "room-status-changed", {
    roomId: updated.id,
    status: updated.status,
  });

  return NextResponse.json({ status: updated.status });
}
