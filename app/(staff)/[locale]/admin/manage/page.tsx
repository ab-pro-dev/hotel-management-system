import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ManageView from "@/components/admin/manage-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Manage",
};

export default async function ManagePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [roomTypes, rooms] = await Promise.all([
    prisma.roomType.findMany({
      include: { rooms: true },
      orderBy: { title: "asc" },
    }),
    prisma.room.findMany({
      include: { roomType: true },
      orderBy: { roomNumber: "asc" },
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage</h1>
        <p className="text-muted-foreground">
          Create, edit, and delete room types and rooms.
        </p>
      </div>
      <ManageView roomTypes={serializedRoomTypes} rooms={serializedRooms} />
    </div>
  );
}
