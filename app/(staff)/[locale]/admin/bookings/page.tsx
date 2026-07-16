import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import BookingsView from "@/components/admin/bookings-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Bookings",
};

export default async function BookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const bookings = await prisma.booking.findMany({
    include: {
      guest: { select: { name: true, email: true } },
      room: { include: { roomType: { select: { title: true } } } },
    },
    orderBy: { checkInDate: "desc" },
  });

  const serialized = bookings.map((b) => ({
    id: b.id,
    guestName: b.guest.name,
    guestEmail: b.guest.email,
    roomNumber: b.room.roomNumber,
    roomType: b.room.roomType.title,
    checkInDate: b.checkInDate.toISOString(),
    checkOutDate: b.checkOutDate.toISOString(),
    totalPrice: Number(b.totalPrice),
    status: b.status,
    createdAt: b.checkInDate.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Bookings</h1>
        <p className="text-muted-foreground">View and manage all guest bookings.</p>
      </div>
      <BookingsView bookings={serialized} />
    </div>
  );
}
