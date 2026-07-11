import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Star } from "lucide-react";
import ReviewForm from "@/components/review-form";
import ServiceRequests from "@/components/service-requests";

export const metadata = {
  title: "My Dashboard",
};

export default async function GuestDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [upcomingBookings, pastBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        guestId: session.user.id,
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
      include: {
        room: { include: { roomType: true } },
        review: true,
      },
      orderBy: { checkInDate: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        guestId: session.user.id,
        status: "CHECKED_OUT",
      },
      include: {
        room: { include: { roomType: true } },
        review: true,
      },
      orderBy: { checkOutDate: "desc" },
    }),
  ]);

  const qrCodes: Record<string, string> = {};
  for (const booking of upcomingBookings) {
    if (booking.status === "CONFIRMED" && booking.checkInToken) {
      qrCodes[booking.id] = await QRCode.toDataURL(
        `/checkin/${booking.checkInToken}`,
        { width: 160, margin: 1 }
      );
    }
  }

  const checkedInBooking = upcomingBookings.find((b) => b.status === "CHECKED_IN");
  let serviceRequests: Array<{
    id: string;
    type: "HOUSEKEEPING" | "FRONT_DESK" | "MAINTENANCE";
    message: string;
    status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
    createdAt: Date;
  }> = [];
  if (checkedInBooking) {
    serviceRequests = await prisma.serviceRequest.findMany({
      where: { bookingId: checkedInBooking.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name || "Guest"}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Stays</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-muted-foreground">No upcoming bookings.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{booking.room.roomType.title}</CardTitle>
                    <Badge variant={booking.status === "CHECKED_IN" ? "default" : "secondary"}>
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription>Room {booking.room.roomNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Check-in: </span>
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Check-out: </span>
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </div>
                  {qrCodes[booking.id] && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Scan to check in:</p>
                      <img
                        src={qrCodes[booking.id]}
                        alt="Check-in QR code"
                        width={160}
                        height={160}
                        className="rounded-lg border"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {checkedInBooking && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Service Requests</h2>
          <ServiceRequests
            bookingId={checkedInBooking.id}
            initialRequests={serviceRequests.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Past Stays</h2>
        {pastBookings.length === 0 ? (
          <p className="text-muted-foreground">No past bookings.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{booking.room.roomType.title}</CardTitle>
                    <Badge variant="outline">CHECKED OUT</Badge>
                  </div>
                  <CardDescription>Room {booking.room.roomNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Dates: </span>
                    {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Bill
                  </Button>
                  {booking.review ? (
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < booking.review!.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{booking.review.comment}</p>
                    </div>
                  ) : (
                    <ReviewForm bookingId={booking.id} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
