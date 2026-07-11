"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
} from "@/lib/actions/notification";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUnreadCount().then(setUnread);
  }, []);

  useEffect(() => {
    if (!open) return;
    getNotifications().then((data) =>
      setNotifications(
        data.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }))
      )
    );
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkRead() {
    await markAllNotificationsRead();
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        className="relative gap-1"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-background shadow-md">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm font-medium">Notifications</span>
            {unread > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={handleMarkRead}
              >
                <Check className="h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b px-4 py-3 last:border-0 ${
                    n.read ? "opacity-60" : "bg-primary/5"
                  }`}
                >
                  <p className="text-sm">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
