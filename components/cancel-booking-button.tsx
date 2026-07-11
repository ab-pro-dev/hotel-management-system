"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import { cancelBooking } from "@/lib/actions/booking";

type Props = {
  bookingId: string;
  checkInDate: string;
};

export default function CancelBookingButton({ bookingId, checkInDate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hoursUntilCheckIn =
    (new Date(checkInDate).getTime() - Date.now()) / (1000 * 60 * 60);
  const within48h = hoursUntilCheckIn <= 48;

  async function handleCancel() {
    const message = within48h
      ? "This booking is within 48 hours of check-in. A 50% cancellation fee will apply. Continue?"
      : "Cancel this booking for a full refund?";
    if (!confirm(message)) return;

    setLoading(true);
    setError(null);
    try {
      await cancelBooking(bookingId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to cancel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
        className="gap-1"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
        Cancel Booking
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
