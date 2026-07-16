import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCards from "@/components/admin/dashboard/stat-cards";
import RevenueChart from "@/components/admin/dashboard/revenue-chart";
import RecentBookings from "@/components/admin/dashboard/recent-bookings";
import QuickActions from "@/components/admin/dashboard/quick-actions";
import RoomOccupancy from "@/components/admin/dashboard/room-occupancy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your hotel today.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 w-fit rounded-full">
          <CalendarDays className="h-3.5 w-3.5" />
          Today, {today}
        </Button>
      </div>

      <StatCards />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <RecentBookings />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <RoomOccupancy />
        </div>
      </div>
    </div>
  );
}
