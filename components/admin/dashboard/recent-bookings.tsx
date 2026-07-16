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
    guestName: "Sarah Johnson",
    roomType: "Deluxe Suite",
    date: "May 28, 2026",
    status: "Confirmed",
    amount: 340,
  },
  {
    id: "2",
    guestName: "Michael Chen",
    roomType: "Standard Room",
    date: "May 27, 2026",
    status: "Check-in",
    amount: 180,
  },
  {
    id: "3",
    guestName: "Emma Williams",
    roomType: "Executive Suite",
    date: "May 27, 2026",
    status: "Pending",
    amount: 520,
  },
  {
    id: "4",
    guestName: "James Brown",
    roomType: "Deluxe Room",
    date: "May 26, 2026",
    status: "Confirmed",
    amount: 260,
  },
  {
    id: "5",
    guestName: "Olivia Davis",
    roomType: "Standard Room",
    date: "May 26, 2026",
    status: "Check-in",
    amount: 180,
  },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Check-in": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function RecentBookings() {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
        <Link
          href="/admin/bookings"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-3 px-5 py-3"
            >
              <Avatar size="sm">
                <AvatarFallback className="text-xs">
                  {getInitials(booking.guestName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {booking.guestName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.roomType}
                </p>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {booking.date}
              </p>
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 border ${statusColors[booking.status] ?? ""}`}
              >
                {booking.status}
              </Badge>
              <p className="text-sm font-semibold tabular-nums shrink-0">
                ${booking.amount}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
