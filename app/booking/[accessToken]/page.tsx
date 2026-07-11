import { notFound } from "next/navigation";
import { Metadata } from "next";
import QRCode from "qrcode";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Clock, XCircle, Calendar, BedDouble } from "lucide-react";

type Props = {
  params: Promise<{ accessToken: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { accessToken } = await params;
  const booking = await prisma.booking.findUnique({
    where: { bookingAccessToken: accessToken },
    include: { room: { include: { roomType: true } } },
  });
  if (!booking) return { title: "Booking Not Found" };
  return {
    title: `Booking — ${booking.room.roomType.title}`,
    description: `Your booking at Grand Raya Hotel for ${booking.room.roomType.title}`,
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CHECKED_IN: { label: "Checked In", color: "bg-blue-100 text-blue-800", icon: BedDouble },
  CHECKED_OUT: { label: "Checked Out", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default async function BookingPage({ params }: Props) {
  const { accessToken } = await params;

  const booking = await prisma.booking.findUnique({
    where: { bookingAccessToken: accessToken },
    include: {
      room: { include: { roomType: true } },
      payment: true,
    },
  });

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl mt-4">Booking Not Found</CardTitle>
            <CardDescription>
              This booking link is invalid or has expired. Please check the URL and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusInfo.icon;

  let qrDataUrl: string | null = null;
  if (booking.status === "CONFIRMED" && booking.checkInToken) {
    qrDataUrl = await QRCode.toDataURL(`/checkin/${booking.checkInToken}`, {
      width: 200,
      margin: 1,
    });
  }

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Grand Raya Hotel</h1>
        <p className="text-muted-foreground">Your Booking Confirmation</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{booking.room.roomType.title}</CardTitle>
            <Badge variant="secondary" className={statusInfo.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>
          <CardDescription>Room {booking.room.roomNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Check-in</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{nights} {nights === 1 ? "night" : "nights"}</span>
              <span className="text-lg font-bold">${Number(booking.totalPrice).toFixed(2)}</span>
            </div>
            {booking.payment && (
              <p className="mt-1 text-xs text-muted-foreground">
                Paid via {booking.payment.paymentMethod} — txn {booking.payment.transactionId.slice(0, 12)}
              </p>
            )}
          </div>

          {qrDataUrl && (
            <div className="rounded-lg border p-4 text-center space-y-2">
              <p className="text-sm font-medium">Check-in QR Code</p>
              <p className="text-xs text-muted-foreground">Show this at the front desk on arrival</p>
              <img
                src={qrDataUrl}
                alt="Check-in QR code"
                width={200}
                height={200}
                className="mx-auto rounded-lg"
              />
            </div>
          )}

          {booking.status === "CONFIRMED" && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 text-center">
              <Clock className="mx-auto mb-1 h-4 w-4" />
              Check-in is available on your arrival date. Present the QR code above at the front desk.
            </div>
          )}

          <Button className="w-full gap-2" render={<a href={`/api/bills/public?token=${accessToken}`} target="_blank" />}>
            <Download className="h-4 w-4" />
            Download Bill
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
