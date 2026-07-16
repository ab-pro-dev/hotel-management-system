"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Loader2, AlertCircle, X, CalendarDays } from "lucide-react";
import { updateBookingStatus, cancelBooking } from "@/lib/actions/booking";

type Booking = {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-secondary text-secondary-foreground",
  CONFIRMED: "bg-primary/10 text-primary",
  CHECKED_IN: "bg-primary text-primary-foreground",
  CHECKED_OUT: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["CHECKED_OUT", "CANCELLED"],
};

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] as const;

export default function BookingsView({ bookings: initialBookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [bookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusDialog, setStatusDialog] = useState<{ booking: Booking; newStatus: string } | null>(null);
  const [cancelDialog, setCancelDialog] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        const match =
          b.guestName.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.roomNumber.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (dateFrom) {
        const from = new Date(dateFrom);
        const checkIn = new Date(b.checkInDate);
        if (checkIn < from) return false;
      }

      if (dateTo) {
        const to = new Date(dateTo);
        const checkOut = new Date(b.checkOutDate);
        if (checkOut > to) return false;
      }

      return true;
    });
  }, [bookings, search, statusFilter, dateFrom, dateTo]);

  async function handleStatusUpdate() {
    if (!statusDialog) return;
    setError(null);
    setSaving(true);
    try {
      await updateBookingStatus(statusDialog.booking.id, statusDialog.newStatus);
      setStatusDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to update booking status.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!cancelDialog) return;
    setError(null);
    setSaving(true);
    try {
      await cancelBooking(cancelDialog.id);
      setCancelDialog(null);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to cancel booking.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by guest, email, booking ID, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[150px]"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[150px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
            {s !== "ALL" && (
              <span className="ml-1.5 text-muted-foreground">
                ({bookings.filter((b) => b.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking) => {
                  const transitions = VALID_TRANSITIONS[booking.status] ?? [];
                  const canCancel = transitions.includes("CANCELLED");

                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground truncate">{booking.guestEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{booking.roomNumber}</span>
                        <span className="ml-1 text-xs text-muted-foreground">{booking.roomType}</span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        ${booking.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[booking.status]}>
                          {booking.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {transitions.length > 0 && (
                            <Select
                              value=""
                              onValueChange={(v: string | null) => {
                                if (v) setStatusDialog({ booking, newStatus: v });
                              }}
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                {transitions.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s === "CANCELLED" ? "Cancel" : s.replace("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {canCancel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setCancelDialog(booking)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!statusDialog} onOpenChange={() => setStatusDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Change status for booking{" "}
            <span className="font-medium text-foreground">{statusDialog?.booking.id.slice(0, 8)}...</span>{" "}
            from{" "}
            <span className="font-medium text-foreground">
              {statusDialog?.booking.status.replace("_", " ")}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {statusDialog?.newStatus.replace("_", " ")}
            </span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel booking{" "}
            <span className="font-medium text-foreground">{cancelDialog?.id.slice(0, 8)}...</span> for{" "}
            <span className="font-medium text-foreground">{cancelDialog?.guestName}</span>?
            A refund will be processed according to the cancellation policy.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(null)} disabled={saving}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
