"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, ArrowUpDown, UserPlus, Loader2, AlertCircle, X } from "lucide-react";
import { assignServiceRequest, listStaff } from "@/lib/actions/service-request";
import { pusherClient } from "@/lib/pusher-client";

type MaintenanceRequest = {
  id: string;
  bookingId: string;
  message: string;
  status: string;
  priority: string;
  assignedToUserId: string | null;
  assignedToName: string | null;
  createdAt: string;
  guestName: string;
  roomNumber: string;
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
};

const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-red-100 text-red-800",
  ACKNOWLEDGED: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
};

type Props = {
  initialRequests: MaintenanceRequest[];
};

export default function MaintenancePanel({ initialRequests }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [sortBy, setSortBy] = useState<"priority" | "createdAt">("priority");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listStaff().then(setStaff).catch((e) => {
      console.error(e);
      setError("Failed to load staff list.");
    });
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe("maintenance-requests");

    const handleCreated = (data: Record<string, unknown>) => {
      setRequests((prev) => [
        {
          id: data.id as string,
          bookingId: data.bookingId as string,
          message: data.message as string,
          status: data.status as string,
          priority: (data.priority as string) || "MEDIUM",
          assignedToUserId: null,
          assignedToName: null,
          createdAt: data.createdAt as string,
          guestName: "Guest",
          roomNumber: "...",
        },
        ...prev,
      ]);
    };

    const handleUpdated = (data: Record<string, unknown>) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === data.id
            ? { ...r, status: (data.status as string) ?? r.status, assignedToUserId: (data.assignedToUserId as string) ?? r.assignedToUserId }
            : r
        )
      );
    };

    channel.bind("service-request-created", handleCreated);
    channel.bind("service-request-updated", handleUpdated);

    return () => {
      channel.unbind("service-request-created", handleCreated);
      channel.unbind("service-request-updated", handleUpdated);
      pusherClient.unsubscribe("maintenance-requests");
    };
  }, []);

  const sorted = [...requests].sort((a, b) => {
    if (sortBy === "priority") {
      return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  async function handleAssign(requestId: string, userId: string) {
    setError(null);
    setLoadingId(requestId);
    try {
      const assignedUserId = userId || null;
      await assignServiceRequest(requestId, assignedUserId);
      const assigned = staff.find((s) => s.id === userId);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, assignedToUserId: assignedUserId, assignedToName: assigned?.name ?? null }
            : r
        )
      );
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to assign request.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Maintenance Requests ({requests.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "priority" ? "createdAt" : "priority")}
            className="gap-1"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortBy === "priority" ? "Sort by Time" : "Sort by Priority"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No maintenance requests.</p>
        ) : (
          <div className="space-y-3">
            {sorted.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={PRIORITY_COLORS[req.priority]}>
                      {req.priority}
                    </Badge>
                    <Badge variant="secondary" className={STATUS_COLORS[req.status]}>
                      {req.status}
                    </Badge>
                    <span className="text-sm font-medium">Room {req.roomNumber}</span>
                    <span className="text-xs text-muted-foreground">— {req.guestName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{req.message}</p>
                  {req.assignedToName && (
                    <p className="text-xs text-muted-foreground">
                      Assigned to: <span className="font-medium">{req.assignedToName}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    value={req.assignedToUserId ?? ""}
                    onValueChange={(v: string | null) => handleAssign(req.id, v ?? "")}
                    disabled={loadingId === req.id}
                  >
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                      <UserPlus className="h-3 w-3 mr-1" />
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="text-xs">
                          {s.name} ({s.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingId === req.id && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
