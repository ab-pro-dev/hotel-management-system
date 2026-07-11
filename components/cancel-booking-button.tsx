"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import { cancelBooking } from "@/lib/actions/booking";

type Props = {
  bookingId: string;
  checkInDate: string;
};

export default function CancelBookingButton({ bookingId, checkInDate }: Props) {
  const t = useTranslations("cancel");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hoursUntilCheckIn =
    (new Date(checkInDate).getTime() - Date.now()) / (1000 * 60 * 60);
  const within48h = hoursUntilCheckIn <= 48;

  async function handleCancel() {
    const message = within48h
      ? t("within48h")
      : t("confirmCancel");
    if (!confirm(message)) return;

    setLoading(true);
    setError(null);
    try {
      await cancelBooking(bookingId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("failedCancel"));
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
        {t("cancelBooking")}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
