import { Metadata } from "next";
import prisma from "@/lib/prisma";
import RoomGrid from "@/components/reception/room-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reception — Room Overview",
};

async function getRooms() {
  const rooms = await prisma.room.findMany({
    include: {
      roomType: { select: { title: true, capacity: true } },
      bookings: {
        where: {
          status: { in: ["CONFIRMED", "CHECKED_IN"] },
        },
        select: {
          guest: { select: { name: true } },
          checkInDate: true,
          checkOutDate: true,
        },
        orderBy: { checkInDate: "desc" },
        take: 1,
      },
    },
    orderBy: { roomNumber: "asc" },
  });

  return rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomNumber,
    status: room.status,
    roomType: room.roomType,
    activeBooking: room.bookings[0]
      ? {
          guestName: room.bookings[0].guest.name,
          checkInDate: room.bookings[0].checkInDate.toISOString(),
          checkOutDate: room.bookings[0].checkOutDate.toISOString(),
        }
      : null,
  }));
}

export default async function ReceptionPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Room Overview</h1>
        <p className="text-muted-foreground">Live status of all hotel rooms.</p>
      </div>
      <RoomGrid initialRooms={rooms} />
    </div>
  );
}
