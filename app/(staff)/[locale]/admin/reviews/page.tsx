import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ReviewsView from "@/components/admin/reviews-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Reviews",
};

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const reviews = await prisma.review.findMany({
    include: {
      booking: {
        include: {
          guest: { select: { name: true, email: true } },
          room: { select: { roomNumber: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    hidden: r.hidden,
    createdAt: r.createdAt.toISOString(),
    guestName: r.booking.guest.name,
    guestEmail: r.booking.guest.email,
    roomNumber: r.booking.room.roomNumber,
    bookingId: r.bookingId,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Reviews</h1>
        <p className="text-muted-foreground">View and moderate guest reviews.</p>
      </div>
      <ReviewsView reviews={serialized} />
    </div>
  );
}
