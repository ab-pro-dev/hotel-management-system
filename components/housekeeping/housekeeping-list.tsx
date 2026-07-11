"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cycleRoomStatus } from "@/lib/actions/housekeeping";
import { Loader2 } from "lucide-react";

type Room = {
  id: string;
  roomNumber: string;
  status: string;
  roomType: { title: string };
};

const STATUS_LABELS: Record<string, { label: string; action: string }> = {
  DIRTY: { label: "Needs Cleaning", action: "Start" },
  IN_PROGRESS: { label: "Cleaning", action: "Done" },
};

export default function HousekeepingList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleCycle(roomId: string) {
    setLoadingId(roomId);
    try {
      const updated = await cycleRoomStatus(roomId);
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: updated.status } : r))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  if (rooms.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No rooms need cleaning.
      </div>
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {rooms.map((room) => {
        const info = STATUS_LABELS[room.status];
        if (!info) return null;

        return (
          <div key={room.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-lg font-medium">Room {room.roomNumber}</p>
              <p className="text-sm text-muted-foreground">{room.roomType.title}</p>
              <p className="text-sm text-muted-foreground">{info.label}</p>
            </div>
            <Button
              size="lg"
              className="h-12 min-w-[100px] shrink-0"
              onClick={() => handleCycle(room.id)}
              disabled={loadingId === room.id}
            >
              {loadingId === room.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                info.action
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
