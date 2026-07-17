"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CalendarPlus, Star, CreditCard } from "lucide-react";

const actions = [
  {
    title: "Add New Room",
    description: "Create a new room",
    href: "/admin/manage",
    icon: Plus,
    iconBg: "bg-blue-500",
  },
  {
    title: "New Booking",
    description: "Create a new booking",
    href: "/admin/bookings",
    icon: CalendarPlus,
    iconBg: "bg-emerald-500",
  },
  {
    title: "Manage Reviews",
    description: "View and reply reviews",
    href: "/admin/reviews",
    icon: Star,
    iconBg: "bg-purple-500",
  },
  {
    title: "View Payments",
    description: "Check all transactions",
    href: "/admin/payments",
    icon: CreditCard,
    iconBg: "bg-amber-500",
  },
];

export default function QuickActions() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20 cursor-pointer h-full">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.iconBg} text-white mb-3 shadow-sm`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold mb-1">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
