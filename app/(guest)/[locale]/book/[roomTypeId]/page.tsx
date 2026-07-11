import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BookingWizard from "@/components/booking-wizard";

type Props = {
  params: Promise<{ roomTypeId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
};

export default async function BookRoomPage({ params, searchParams }: Props) {
  const { roomTypeId } = await params;
  const { checkIn, checkOut } = await searchParams;

  const roomType = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
  if (!roomType) notFound();

  return (
    <BookingWizard
      roomType={{
        id: roomType.id,
        title: roomType.title,
        description: roomType.description,
        basePrice: Number(roomType.basePrice),
        capacity: roomType.capacity,
      }}
      initialCheckIn={checkIn ?? null}
      initialCheckOut={checkOut ?? null}
    />
  );
}
