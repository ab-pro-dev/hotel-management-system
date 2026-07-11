import prisma from "@/lib/prisma";

export async function calculateRoomPrice(
  basePrice: number,
  checkInDate: Date,
  roomTypeId: string
): Promise<number> {
  const dateOnly = new Date(checkInDate);
  dateOnly.setHours(0, 0, 0, 0);

  const override = await prisma.priceOverride.findUnique({
    where: {
      roomTypeId_date: {
        roomTypeId,
        date: dateOnly,
      },
    },
  });

  if (override) {
    return Number(override.overridePrice);
  }

  const day = checkInDate.getDay();
  const isWeekend = day === 5 || day === 6;
  const seasonal = isWeekend ? 1.15 : 1.0;

  const rooms = await prisma.room.findMany({
    where: { roomTypeId },
    select: {
      id: true,
      bookings: {
        where: {
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
          checkInDate: { lt: new Date(checkInDate.getTime() + 86400000) },
          checkOutDate: { gt: checkInDate },
        },
        select: { id: true },
      },
    },
  });

  const total = rooms.length;
  const booked = rooms.filter((r) => r.bookings.length > 0).length;
  const ratio = total > 0 ? booked / total : 0;
  const occupancy = ratio > 0.8 ? 1.25 : 1.0;

  return Math.round(basePrice * seasonal * occupancy * 100) / 100;
}
