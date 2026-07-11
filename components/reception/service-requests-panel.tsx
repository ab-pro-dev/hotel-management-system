"use client";

import { useEffect, useState } from "react";
import { ServiceRequestType, ServiceRequestStatus } from "@prisma/client";
import { pusherClient } from "@/lib/pusher-client";
import { updateServiceRequestStatus } from "@/lib/actions/service-request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

type ServiceRequest = {
  id: string;
  bookingId: string;
  type: ServiceRequestType;
  message: string;
  status: ServiceRequestStatus;
  createdAt: string;
  guestName: string;
  roomNumber: string;
};

const TYPE_LABELS: Record<ServiceRequestType, string> = {
  HOUSEKEEPING: "Housekeeping",
  FRONT_DESK: "Front Desk",
  MAINTENANCE: "Maintenance",
};

const STATUS_STYLES: Record<ServiceRequestStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  ACKNOWLEDGED: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};

const CHANNELS = ["housekeeping-requests", "front-desk-requests", "maintenance-requests"];

export default function StaffServiceRequests({
  initialRequests,
}: {
  initialRequests: ServiceRequest[];
}) {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const subscribed = CHANNELS.map((ch) => pusherClient.subscribe(ch));

    subscribed.forEach((channel) => {
      channel.bind("service-request-created", (data: ServiceRequest) => {
        setRequests((prev) => [data, ...prev]);
      });
      channel.bind("service-request-updated", (data: { id: string; status: ServiceRequestStatus }) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === data.id ? { ...r, status: data.status } : r))
        );
      });
    });

    return () => {
      CHANNELS.forEach((ch) => pusherClient.unsubscribe(ch));
    };
  }, []);

  async function handleUpdate(requestId: string, status: ServiceRequestStatus) {
    setLoadingId(requestId);
    try {
      await updateServiceRequestStatus(requestId, status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  }

  const activeRequests = requests.filter((r) => r.status !== "RESOLVED");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Service Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {activeRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active requests.</p>
        ) : (
          <div className="space-y-3">
            {activeRequests.map((req) => (
              <div key={req.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{TYPE_LABELS[req.type]}</Badge>
                    <Badge className={STATUS_STYLES[req.status]}>{req.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium">
                    Room {req.roomNumber} — {req.guestName}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{req.message}</p>
                </div>
                <div className="flex gap-2">
                  {req.status === "OPEN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loadingId === req.id}
                      onClick={() => handleUpdate(req.id, "ACKNOWLEDGED")}
                    >
                      {loadingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Acknowledge"
                      )}
                    </Button>
                  )}
                  {req.status !== "RESOLVED" && (
                    <Button
                      size="sm"
                      disabled={loadingId === req.id}
                      onClick={() => handleUpdate(req.id, "RESOLVED")}
                    >
                      {loadingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
