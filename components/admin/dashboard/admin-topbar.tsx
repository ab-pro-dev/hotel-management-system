"use client";

import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { Search, Moon, Sun, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBell from "@/components/notification-bell";

export default function AdminTopbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const locale = useLocale();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "AD";

  return (
    <header className="flex h-16 items-center border-b border-border bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden mr-3" />

      <div className="relative w-full max-w-sm">
        <Input
          placeholder="Search anything..."
          className="h-10 rounded-full bg-muted pl-4 pr-10 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <NotificationBell />

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="flex items-center gap-2.5 rounded-full outline-none hover:bg-muted px-1 py-1 transition-colors" />}>
            <Avatar size="default">
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-tight">
                {session?.user?.name ?? "Admin"}
              </p>
              <p className="text-[11px] text-muted-foreground">Administrator</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: `/${locale}/login` })}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
