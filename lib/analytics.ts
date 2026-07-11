import prisma from "@/lib/prisma";

export type OccupancyPoint = {
  date: string;
  occupancy: number;
};

export type RevenueSource = {
  source: string;
  amount: number;
};

export type YieldMetrics = {
  adr: number;
  revpar: number;
  totalRevenue: number;
  roomsSold: number;
  availableRooms: number;
};

export async function getOccupancyTrend(days: number): Promise<OccupancyPoint[]> {
  const totalRooms = await prisma.room.count();
  if (totalRooms === 0) return [];

  const now = new Date();
  const results: OccupancyPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const occupied = await prisma.room.count({
      where: {
        bookings: {
          some: {
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
            checkInDate: { lt: nextDay },
            checkOutDate: { gt: date },
          },
        },
      },
    });

    results.push({
      date: date.toISOString().slice(0, 10),
      occupancy: Math.round((occupied / totalRooms) * 10000) / 100,
    });
  }

  return results;
}

export async function getRevenueBreakdown(): Promise<RevenueSource[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        checkInDate: { gte: thirtyDaysAgo },
      },
    },
    select: {
      amount: true,
      status: true,
      booking: {
        select: { status: true },
      },
    },
  });

  const breakdown: Record<string, number> = {
    "Room Bookings": 0,
    Refunds: 0,
  };

  for (const p of payments) {
    const amt = Number(p.amount);
    if (p.status === "PAID" && p.booking.status !== "CANCELLED") {
      breakdown["Room Bookings"] += amt;
    } else if (p.status === "REFUNDED" || p.booking.status === "CANCELLED") {
      breakdown["Refunds"] += amt;
    }
  }

  return Object.entries(breakdown)
    .filter(([, amount]) => amount > 0)
    .map(([source, amount]) => ({
      source,
      amount: Math.round(amount * 100) / 100,
    }));
}

export async function getYieldMetrics(): Promise<YieldMetrics> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalRooms = await prisma.room.count();

  const revenueResult = await prisma.payment.aggregate({
    where: {
      status: "PAID",
      booking: {
        status: { not: "CANCELLED" },
        checkInDate: { gte: thirtyDaysAgo },
      },
    },
    _sum: { amount: true },
  });

  const totalRevenue = Number(revenueResult._sum?.amount ?? 0);

  const roomsSold = await prisma.booking.count({
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
      checkInDate: { gte: thirtyDaysAgo },
    },
  });

  const adr = roomsSold > 0 ? Math.round((totalRevenue / roomsSold) * 100) / 100 : 0;
  const revpar = totalRooms > 0 ? Math.round((totalRevenue / totalRooms) * 100) / 100 : 0;

  return {
    adr,
    revpar,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    roomsSold,
    availableRooms: totalRooms,
  };
}

export type PopularityPoint = {
  roomType: string;
  bookings: number;
};

export async function getPopularityMatrix(): Promise<PopularityPoint[]> {
  const roomTypes = await prisma.roomType.findMany({
    include: {
      rooms: {
        select: {
          _count: {
            select: { bookings: true },
          },
        },
      },
    },
  });

  return roomTypes
    .map((rt) => ({
      roomType: rt.title,
      bookings: rt.rooms.reduce((sum, room) => sum + room._count.bookings, 0),
    }))
    .sort((a, b) => b.bookings - a.bookings);
}
