import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, Tv, Wind, Coffee, Bath, Waves, PawPrint, Eye, Shirt } from "lucide-react";
import PhotoGallery from "@/components/photo-gallery";

const AMENITY_LABELS: Record<string, { labelKey: string; icon: React.ElementType }> = {
  wifi: { labelKey: "wifi", icon: Wifi },
  tv: { labelKey: "tv", icon: Tv },
  "air-conditioning": { labelKey: "airConditioning", icon: Wind },
  "coffee-maker": { labelKey: "coffeeMaker", icon: Coffee },
  minibar: { labelKey: "minibar", icon: Coffee },
  balcony: { labelKey: "balcony", icon: Eye },
  bathrobe: { labelKey: "bathrobe", icon: Shirt },
  "soaking-tub": { labelKey: "soakingTub", icon: Bath },
  "city-views": { labelKey: "cityViews", icon: Eye },
  "pet-friendly": { labelKey: "petFriendly", icon: PawPrint },
};

type Props = {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roomType = await prisma.roomType.findUnique({ where: { id } });
  if (!roomType) return { title: "Room Not Found" };
  return { title: roomType.title, description: roomType.description };
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const { id, locale } = await params;
  const { checkIn, checkOut } = await searchParams;
  const t = await getTranslations({ locale, namespace: "rooms" });

  const roomType = await prisma.roomType.findUnique({
    where: { id },
    include: { rooms: true },
  });

  if (!roomType) notFound();

  const availableRooms = roomType.rooms.filter((r) => r.status === "AVAILABLE");

  const bookHref = `/book/${roomType.id}${
    checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""
  }`;

  return (
    <div className="space-y-8">
      <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {t("backToRooms")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <PhotoGallery urls={roomType.photoUrls} title={roomType.title} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{roomType.title}</CardTitle>
            <CardDescription className="text-base">{roomType.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold">${roomType.basePrice.toFixed(2)}</span>
                <span className="ml-1 text-muted-foreground">{t("perNight")}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {roomType.capacity} {roomType.capacity === 1 ? t("guest") : t("guests")}
              </Badge>
              <Badge variant="outline">
                {availableRooms.length} {availableRooms.length === 1 ? t("roomAvailable") : t("roomsAvailable")}
              </Badge>
            </div>

            {roomType.amenities.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{t("amenities")}</h3>
                <div className="flex flex-wrap gap-2">
                  {roomType.amenities.map((amenity) => {
                    const info = AMENITY_LABELS[amenity] ?? { labelKey: amenity, icon: null };
                    const Icon = info.icon;
                    return (
                      <Badge key={amenity} variant="secondary" className="gap-1">
                        {Icon && <Icon className="h-3 w-3" />}
                        {t(`amenities.${info.labelKey}`)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {checkIn && checkOut && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">{t("selectedDates")}</p>
                <p className="font-medium">
                  {new Date(checkIn).toLocaleDateString()} — {new Date(checkOut).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" render={<Link href={bookHref} />}>
              {t("bookNow")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
