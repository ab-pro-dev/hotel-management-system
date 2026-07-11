import { Metadata } from "next";
import prisma from "@/lib/prisma";
import HousekeepingList from "@/components/housekeeping/housekeeping-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Housekeeping",
};

async function getDirtyRooms() {
  const rooms = await prisma.room.findMany({
    where: { status: { in: ["DIRTY", "IN_PROGRESS"] } },
    include: { roomType: { select: { title: true } } },
    orderBy: { roomNumber: "asc" },
  });

  return rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomNumber,
    status: room.status,
    roomType: room.roomType,
  }));
}

export default async function HousekeepingPage() {
  const rooms = await getDirtyRooms();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Housekeeping</h1>
        <p className="text-muted-foreground">Rooms that need cleaning.</p>
      </div>
      <HousekeepingList initialRooms={rooms} />
    </div>
  );
}
