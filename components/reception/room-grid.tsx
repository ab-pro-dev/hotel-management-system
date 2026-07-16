"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RoomData = {
  id: string;
  roomNumber: string;
  status: string;
  roomType: {
    title: string;
    capacity: number;
  };
  activeBooking: {
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
  } | null;
};

const STATUS_STYLES: Record<string, { bg: string; border: string; badge: string }> = {
  AVAILABLE: {
    bg: "bg-card",
    border: "border-primary/40",
    badge: "bg-primary/10 text-primary",
  },
  OCCUPIED: {
    bg: "bg-card",
    border: "border-destructive/40",
    badge: "bg-destructive/10 text-destructive",
  },
  DIRTY: {
    bg: "bg-card",
    border: "border-secondary",
    badge: "bg-secondary text-secondary-foreground",
  },
  IN_PROGRESS: {
    bg: "bg-card",
    border: "border-primary/20",
    badge: "bg-primary/5 text-primary",
  },
  MAINTENANCE: {
    bg: "bg-card",
    border: "border-muted",
    badge: "bg-muted text-muted-foreground",
  },
};

function RoomTile({ room }: { room: RoomData }) {
  const styles = STATUS_STYLES[room.status] ?? STATUS_STYLES.MAINTENANCE;

  return (
    <Card className={`${styles.bg} ${styles.border} border-2 transition-colors`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{room.roomNumber}</CardTitle>
          <Badge className={styles.badge}>{room.status}</Badge>
        </div>
        <CardDescription>{room.roomType.title}</CardDescription>
      </CardHeader>
      <div className="px-4 pb-4">
        {room.activeBooking ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium">{room.activeBooking.guestName}</p>
            <p className="text-muted-foreground">
              {new Date(room.activeBooking.checkInDate).toLocaleDateString()} —{" "}
              {new Date(room.activeBooking.checkOutDate).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active booking</p>
        )}
      </div>
    </Card>
  );
}

export default function RoomGrid({ initialRooms }: { initialRooms: RoomData[] }) {
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);

  useEffect(() => {
    const channel = pusherClient.subscribe("rooms");

    channel.bind("room-status-changed", (data: { roomId: string; status: string }) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === data.roomId ? { ...room, status: data.status } : room
        )
      );
    });

    return () => {
      pusherClient.unsubscribe("rooms");
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room) => (
        <RoomTile key={room.id} room={room} />
      ))}
    </div>
  );
}
