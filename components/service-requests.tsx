"use client";

import { useEffect, useState } from "react";
import { ServiceRequestType, ServiceRequestStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { pusherClient } from "@/lib/pusher-client";
import { createServiceRequest } from "@/lib/actions/service-request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";

type ServiceRequest = {
  id: string;
  type: ServiceRequestType;
  message: string;
  status: ServiceRequestStatus;
  createdAt: string;
};

const STATUS_STYLES: Record<ServiceRequestStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  ACKNOWLEDGED: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};

export default function ServiceRequests({
  bookingId,
  initialRequests,
}: {
  bookingId: string;
  initialRequests: ServiceRequest[];
}) {
  const t = useTranslations("serviceRequest");
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [type, setType] = useState<ServiceRequestType>("HOUSEKEEPING");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const TYPE_LABELS: Record<ServiceRequestType, string> = {
    HOUSEKEEPING: t("housekeeping"),
    FRONT_DESK: t("frontDesk"),
    MAINTENANCE: t("maintenance"),
  };

  useEffect(() => {
    const channels = ["housekeeping-requests", "front-desk-requests", "maintenance-requests"];
    const subscribed = channels.map((ch) => pusherClient.subscribe(ch));

    subscribed.forEach((channel) => {
      channel.bind("service-request-created", (data: ServiceRequest & { bookingId: string }) => {
        if (data.bookingId === bookingId) {
          setRequests((prev) => [data, ...prev]);
        }
      });
      channel.bind("service-request-updated", (data: { id: string; status: ServiceRequestStatus }) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === data.id ? { ...r, status: data.status } : r))
        );
      });
    });

    return () => {
      channels.forEach((ch) => pusherClient.unsubscribe(ch));
    };
  }, [bookingId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createServiceRequest(bookingId, type, message);
      setMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("requestService")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t("type")}</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ServiceRequestType)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t("message")}</Label>
              <Input
                id="message"
                placeholder={t("messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="gap-2" disabled={loading || !message}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t("sendRequest")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("yourRequests")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{TYPE_LABELS[req.type]}</span>
                      <Badge className={STATUS_STYLES[req.status]}>{req.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{req.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
