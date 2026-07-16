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

  const [roomTypes, rooms, staffUsers] = await Promise.all([
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Manage</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete room types, rooms, and staff.
        </p>
      </div>
      <ManageView
        roomTypes={serializedRoomTypes}
        rooms={serializedRooms}
        staffUsers={serializedStaff}
      />
    </div>
  );
}
