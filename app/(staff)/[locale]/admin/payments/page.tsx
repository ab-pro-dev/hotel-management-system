import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import PaymentsView from "@/components/admin/payments-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Payments",
};

export default async function PaymentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          guest: { select: { name: true, email: true } },
          room: { select: { roomNumber: true } },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  const serialized = payments.map((p) => ({
    id: p.id,
    guestName: p.booking.guest.name,
    guestEmail: p.booking.guest.email,
    roomNumber: p.booking.room.roomNumber,
    bookingId: p.bookingId,
    amount: Number(p.amount),
    paymentMethod: p.paymentMethod,
    transactionId: p.transactionId,
    status: p.status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Payments</h1>
        <p className="text-muted-foreground">View all payment transactions.</p>
      </div>
      <PaymentsView payments={serialized} />
    </div>
  );
}
