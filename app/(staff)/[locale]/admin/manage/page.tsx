import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ManageView from "@/components/admin/manage-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Manage",
};

export default async function ManagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const [roomTypes, rooms, staffUsers, properties, coupons, waitlistEntries, serviceRequests] = await Promise.all([
    prisma.roomType.findMany({
      include: { rooms: true },
      orderBy: { title: "asc" },
    }),
    prisma.room.findMany({
      include: { roomType: true },
      orderBy: { roomNumber: "asc" },
    }),
    prisma.user.findMany({
      where: { role: { in: ["RECEPTIONIST", "HOUSEKEEPER", "ADMIN"] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.findMany({
      include: { _count: { select: { roomTypes: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.waitlist.findMany({
      include: { roomType: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      include: {
        booking: {
          include: {
            guest: { select: { name: true, email: true } },
            room: { select: { roomNumber: true } },
          },
        },
        assignedTo: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedRoomTypes = roomTypes.map((rt) => ({
    id: rt.id,
    title: rt.title,
    description: rt.description,
    basePrice: Number(rt.basePrice),
    capacity: rt.capacity,
    propertyId: rt.propertyId,
    roomCount: rt.rooms.length,
  }));

  const serializedRooms = rooms.map((r) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    status: r.status,
    roomType: { id: r.roomType.id, title: r.roomType.title },
  }));

  const serializedStaff = staffUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedProperties = properties.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    roomTypeCount: p._count.roomTypes,
  }));

  const serializedCoupons = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: Number(c.discountValue),
    expiresAt: c.expiresAt.toISOString(),
    maxUses: c.maxUses,
    usedCount: c.usedCount,
  }));

  const serializedWaitlist = waitlistEntries.map((w) => ({
    id: w.id,
    guestEmail: w.guestEmail,
    roomTypeTitle: w.roomType.title,
    roomTypeId: w.roomTypeId,
    requestedCheckIn: w.requestedCheckIn.toISOString(),
    requestedCheckOut: w.requestedCheckOut.toISOString(),
    notified: w.notified,
  }));

  const serializedServiceRequests = serviceRequests.map((sr) => ({
    id: sr.id,
    type: sr.type,
    message: sr.message,
    status: sr.status,
    priority: sr.priority,
    createdAt: sr.createdAt.toISOString(),
    guestName: sr.booking.guest.name,
    guestEmail: sr.booking.guest.email,
    roomNumber: sr.booking.room.roomNumber,
    bookingId: sr.bookingId,
    assignedToName: sr.assignedTo?.name ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Manage</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete room types, rooms, staff, properties, coupons, waitlist entries, and service requests.
        </p>
      </div>
      <ManageView
        roomTypes={serializedRoomTypes}
        rooms={serializedRooms}
        staffUsers={serializedStaff}
        properties={serializedProperties}
        coupons={serializedCoupons}
        waitlistEntries={serializedWaitlist}
        serviceRequests={serializedServiceRequests}
      />
    </div>
  );
}
