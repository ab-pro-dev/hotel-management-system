import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Star, Award } from "lucide-react";
import ReviewForm from "@/components/review-form";
import ServiceRequests from "@/components/service-requests";
import CancelBookingButton from "@/components/cancel-booking-button";

export const metadata = {
  title: "My Dashboard",
};

export default async function GuestDashboard() {
  const t = await getTranslations("dashboard");
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [guest, upcomingBookings, pastBookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { loyaltyPoints: true, loyaltyTier: true },
    }),
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
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("welcome", { name: session.user.name || t("guestDefault") })}</p>
      </div>

      {guest && (
        <Card>
          <CardContent className="flex items-center gap-6 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{guest.loyaltyPoints.toLocaleString()} {t("loyaltyPoints")}</span>
                <Badge variant="secondary" className="text-xs">
                  {guest.loyaltyTier}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {guest.loyaltyTier === "GOLD"
                  ? t("topTier")
                  : guest.loyaltyTier === "SILVER"
                    ? `${(10000 - guest.loyaltyPoints).toLocaleString()} ${t("ptsToGold")}`
                    : `${(3000 - guest.loyaltyPoints).toLocaleString()} ${t("ptsToSilver")}`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("upcomingStays")}</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-muted-foreground">{t("noUpcoming")}</p>
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
                    <span className="text-muted-foreground">{t("checkIn")}: </span>
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t("checkOut")}: </span>
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </div>
                  {qrCodes[booking.id] && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">{t("scanToCheckIn")}</p>
                      <img
                        src={qrCodes[booking.id]}
                        alt="Check-in QR code"
                        width={160}
                        height={160}
                        className="rounded-lg border"
                      />
                    </div>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <div className="pt-2">
                      <CancelBookingButton
                        bookingId={booking.id}
                        checkInDate={booking.checkInDate.toISOString()}
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
          <h2 className="text-lg font-semibold">{t("serviceRequests")}</h2>
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
        <h2 className="text-lg font-semibold">{t("pastStays")}</h2>
        {pastBookings.length === 0 ? (
          <p className="text-muted-foreground">{t("noPast")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{booking.room.roomType.title}</CardTitle>
                    <Badge variant="outline">{t("checkedOut")}</Badge>
                  </div>
                  <CardDescription>Room {booking.room.roomNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t("dates")}: </span>
                    {new Date(booking.checkInDate).toLocaleDateString()} — {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" render={<a href={`/api/bills?bookingId=${booking.id}`} target="_blank" />}>
                    <Download className="h-4 w-4" />
                    {t("downloadBill")}
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
