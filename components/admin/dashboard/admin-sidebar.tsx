"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  Crown,
  LayoutDashboard,
  Bed,
  CalendarDays,
  Star,
  CreditCard,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Rooms", href: "/admin/manage", icon: Bed },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Crown className="h-5 w-5" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold leading-tight tracking-tight">
              Grand Raya Hotel
            </p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  className={
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                      : ""
                  }
                  render={
                    <Link
                      href={item.href}
                      className="flex items-center gap-3"
                    />
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="rounded-xl bg-primary/5 p-4 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Upgrade to Pro</p>
          </div>
          <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
            Get advanced analytics, priority support, and more features.
          </p>
          <Button size="sm" className="w-full text-xs">
            Upgrade Now
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
