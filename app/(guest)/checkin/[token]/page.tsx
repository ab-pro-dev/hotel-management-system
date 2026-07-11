import Link from "next/link";
import { verifyAndCheckIn } from "@/lib/actions/qr-checkin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, DoorOpen } from "lucide-react";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function CheckInPage({ params }: Props) {
  const { token } = await params;

  let result: { success: true; roomNumber: string } | { success: false; error: string };

  try {
    const booking = await verifyAndCheckIn(token);
    result = { success: true, roomNumber: booking.roomId };
  } catch (e) {
    result = { success: false, error: e instanceof Error ? e.message : "Check-in failed" };
  }

  if (result.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl mt-4">You&apos;re checked in!</CardTitle>
            <CardDescription>
              Room <span className="font-medium text-foreground">{result.roomNumber}</span> is ready for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" render={<Link href="/dashboard" />}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Check-in Unavailable</CardTitle>
          <CardDescription>{result.error}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <DoorOpen className="h-4 w-4" />
              <span>Please visit the front desk for assistance.</span>
            </div>
          </div>
          <Button className="w-full" variant="outline" render={<Link href="/rooms" />}>
            Browse Rooms
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
