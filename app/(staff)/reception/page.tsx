import { Metadata } from "next";
import prisma from "@/lib/prisma";
import RoomGrid from "@/components/reception/room-grid";
import StaffServiceRequests from "@/components/reception/service-requests-panel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reception — Room Overview",
};

async function getRooms(propertyId?: string) {
  const rooms = await prisma.room.findMany({
    where: propertyId
      ? { roomType: { propertyId } }
      : undefined,
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

async function getServiceRequests(propertyId?: string) {
  const requests = await prisma.serviceRequest.findMany({
    where: {
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

type ReceptionSearchParams = {
  propertyId?: string;
};

export default async function ReceptionPage({
  searchParams,
}: {
  searchParams: Promise<ReceptionSearchParams>;
}) {
  const params = await searchParams;
  const [rooms, serviceRequests] = await Promise.all([
    getRooms(params.propertyId),
    getServiceRequests(params.propertyId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Room Overview</h1>
        <p className="text-muted-foreground">Live status of all hotel rooms.</p>
      </div>
      <RoomGrid initialRooms={rooms} />
      <StaffServiceRequests initialRequests={serviceRequests} />
    </div>
  );
}
