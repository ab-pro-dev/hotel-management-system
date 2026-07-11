import { Metadata } from "next";
import prisma from "@/lib/prisma";
import HousekeepingList from "@/components/housekeeping/housekeeping-list";
import HousekeepingRequests from "@/components/housekeeping/housekeeping-requests";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Housekeeping",
};

async function getDirtyRooms(propertyId?: string) {
  const rooms = await prisma.room.findMany({
    where: {
      status: { in: ["DIRTY", "IN_PROGRESS"] },
      ...(propertyId ? { roomType: { propertyId } } : {}),
    },
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

async function getHousekeepingRequests(propertyId?: string) {
  const requests = await prisma.serviceRequest.findMany({
    where: {
      type: "HOUSEKEEPING",
      status: { not: "RESOLVED" },
      ...(propertyId
        ? { booking: { room: { roomType: { propertyId } } } }
        : {}),
    },
    include: {
      booking: {
        include: {
          room: { select: { roomNumber: true } },
          guest: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return requests.map((r) => ({
    id: r.id,
    bookingId: r.bookingId,
    type: r.type,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    guestName: r.booking.guest.name,
    roomNumber: r.booking.room.roomNumber,
  }));
}

type HousekeepingSearchParams = {
  propertyId?: string;
};

export default async function HousekeepingPage({
  searchParams,
}: {
  searchParams: Promise<HousekeepingSearchParams>;
}) {
  const params = await searchParams;
  const [rooms, serviceRequests] = await Promise.all([
    getDirtyRooms(params.propertyId),
    getHousekeepingRequests(params.propertyId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Housekeeping</h1>
        <p className="text-muted-foreground">Rooms that need cleaning and guest requests.</p>
      </div>
      <HousekeepingRequests initialRequests={serviceRequests} />
      <HousekeepingList initialRooms={rooms} />
    </div>
  );
}
