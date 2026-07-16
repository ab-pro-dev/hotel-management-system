import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Settings, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Admin</h1>
        <p className="text-muted-foreground">Hotel management overview.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/analytics" className="group">
          <Card className="transition-colors group-hover:border-primary/50">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-3 text-base">Analytics</CardTitle>
              <CardDescription>Revenue and occupancy insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-primary transition-colors group-hover:text-primary/80">
                View analytics →
              </span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/manage" className="group">
          <Card className="transition-colors group-hover:border-primary/50">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-3 text-base">Manage</CardTitle>
              <CardDescription>Create, edit, and delete room types and rooms.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-primary transition-colors group-hover:text-primary/80">
                Manage rooms →
              </span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/bookings" className="group">
          <Card className="transition-colors group-hover:border-primary/50">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-3 text-base">Bookings</CardTitle>
              <CardDescription>View and manage all guest bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-primary transition-colors group-hover:text-primary/80">
                View bookings →
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
