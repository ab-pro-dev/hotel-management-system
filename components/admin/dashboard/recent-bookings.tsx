"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Booking = {
  id: string;
  guestName: string;
  roomType: string;
  date: string;
  status: string;
  amount: number;
};

const recentBookings: Booking[] = [
  {
    id: "1",
    guestName: "John Smith",
    roomType: "Deluxe Room",
    date: "May 30, 2026",
    status: "Confirmed",
    amount: 250,
  },
  {
    id: "2",
    guestName: "Emma Wilson",
    roomType: "Family Suite",
    date: "May 30, 2026",
    status: "Confirmed",
    amount: 450,
  },
  {
    id: "3",
    guestName: "Michael Brown",
    roomType: "Standard Room",
    date: "May 30, 2026",
    status: "Check-in",
    amount: 180,
  },
  {
    id: "4",
    guestName: "Sarah Johnson",
    roomType: "Deluxe Room",
    date: "May 29, 2026",
    status: "Confirmed",
    amount: 250,
  },
  {
    id: "5",
    guestName: "David Lee",
    roomType: "Single Room",
    date: "May 29, 2026",
    status: "Pending",
    amount: 120,
  },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Check-in": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function RecentBookings() {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-5">
        <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
        <Link
          href="/admin/bookings"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0 px-1">
        <div className="divide-y divide-border">
          {recentBookings.map((booking, i) => (
            <div
              key={booking.id}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <Avatar size="default">
                <AvatarFallback className={`text-xs font-medium ${avatarColors[i % avatarColors.length]}`}>
                  {getInitials(booking.guestName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {booking.guestName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.roomType}
                </p>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                {booking.date}
              </p>
              <Badge
                variant="outline"
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 border ${statusStyles[booking.status] ?? ""}`}
              >
                {booking.status}
              </Badge>
              <p className="text-sm font-bold tabular-nums shrink-0">
                ${booking.amount}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
