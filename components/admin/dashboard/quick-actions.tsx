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
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    title: "New Booking",
    description: "Create a new booking",
    href: "/admin/bookings",
    icon: CalendarPlus,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    title: "Manage Reviews",
    description: "View and reply reviews",
    href: "/admin/reviews",
    icon: Star,
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  },
  {
    title: "View Payments",
    description: "Check all transactions",
    href: "/admin/payments",
    icon: CreditCard,
    color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  },
];

export default function QuickActions() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="rounded-xl shadow-sm border-0 bg-card transition-colors hover:bg-accent/50 cursor-pointer h-full">
              <CardContent className="p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${action.color} mb-3`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold mb-0.5">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
