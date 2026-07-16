"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cycleRoomStatus } from "@/lib/actions/housekeeping";
import { queueAction } from "@/lib/offline-queue";
import { Loader2, WifiOff, AlertCircle, X } from "lucide-react";

type Room = {
  id: string;
  roomNumber: string;
  status: string;
  roomType: { title: string };
};

const STATUS_LABELS: Record<string, { label: string; action: string; badge: string }> = {
  DIRTY: { label: "Needs Cleaning", action: "Start", badge: "bg-secondary text-secondary-foreground" },
  IN_PROGRESS: { label: "Cleaning", action: "Done", badge: "bg-primary/10 text-primary" },
};

export default function HousekeepingList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const STATUS_CYCLE: Record<string, string> = {
    DIRTY: "IN_PROGRESS",
    IN_PROGRESS: "AVAILABLE",
  };

  async function handleCycle(room: Room) {
    const nextStatus = STATUS_CYCLE[room.status];
    if (!nextStatus) return;

    setError(null);
    setLoadingId(room.id);

    if (!navigator.onLine) {
      setPendingIds((prev) => new Set(prev).add(room.id));
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: nextStatus } : r))
      );
      await queueAction({
        url: "/api/housekeeping/status",
        body: { roomId: room.id, status: nextStatus },
      });
      setLoadingId(null);
      return;
    }

    try {
      const updated = await cycleRoomStatus(room.id);
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: updated.status } : r))
      );
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update room status.");
    } finally {
      setLoadingId(null);
    }
  }

  const visibleRooms = rooms.filter((r) => STATUS_LABELS[r.status]);

  if (visibleRooms.length === 0 && !error) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No rooms need cleaning.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {visibleRooms.map((room) => {
            const info = STATUS_LABELS[room.status];
            const isPending = pendingIds.has(room.id);

            return (
              <div key={room.id} className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium">Room {room.roomNumber}</p>
                    <Badge className={info.badge}>{info.label}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{room.roomType.title}</p>
                </div>
                <Button
                  size="lg"
                  className="h-12 min-w-[100px] shrink-0"
                  onClick={() => handleCycle(room)}
                  disabled={loadingId === room.id}
                >
                  {loadingId === room.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPending ? (
                    <WifiOff className="h-5 w-5" />
                  ) : (
                    info.action
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
