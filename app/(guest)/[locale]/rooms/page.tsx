import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { calculateRoomPrice } from "@/lib/pricing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Wifi, Tv, Wind, Coffee, Bath, Eye, PawPrint, Shirt } from "lucide-react";

const AVAILABLE_AMENITIES = [
  { value: "wifi", labelKey: "wifi", icon: Wifi },
  { value: "tv", labelKey: "tv", icon: Tv },
  { value: "air-conditioning", labelKey: "airConditioning", icon: Wind },
  { value: "coffee-maker", labelKey: "coffeeMaker", icon: Coffee },
  { value: "minibar", labelKey: "minibar", icon: Coffee },
  { value: "balcony", labelKey: "balcony", icon: Eye },
  { value: "bathrobe", labelKey: "bathrobe", icon: Shirt },
  { value: "soaking-tub", labelKey: "soakingTub", icon: Bath },
  { value: "city-views", labelKey: "cityViews", icon: Eye },
  { value: "pet-friendly", labelKey: "petFriendly", icon: PawPrint },
];

export const metadata: Metadata = {
  title: "Discover Rooms",
  description: "Browse available room types and book your stay.",
};

type SearchParams = {
  propertyId?: string;
  checkIn?: string;
  checkOut?: string;
  capacity?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
};

async function getAvailableRoomTypes(searchParams: SearchParams) {
  const { propertyId, checkIn, checkOut, capacity, minPrice, maxPrice, amenities } = searchParams;

  const where: Record<string, unknown> = {};

  if (propertyId) {
    where.propertyId = propertyId;
  }

  if (capacity) {
    where.capacity = { gte: parseInt(capacity, 10) };
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) (where.basePrice as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.basePrice as Record<string, number>).lte = parseFloat(maxPrice);
  }

  if (amenities) {
    const selected = amenities.split(",").filter(Boolean);
    if (selected.length > 0) {
      where.amenities = { hasEvery: selected };
    }
  }

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    where.rooms = {
      some: {
        status: "AVAILABLE",
        bookings: {
          none: {
            status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            checkInDate: { lt: checkOutDate },
            checkOutDate: { gt: checkInDate },
          },
        },
      },
    };
  } else {
    where.rooms = {
      some: {
        status: "AVAILABLE",
      },
    };
  }

  return prisma.roomType.findMany({
    where,
    include: {
      rooms: {
        where: checkIn && checkOut
          ? {
              status: "AVAILABLE",
              bookings: {
                none: {
                  status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
                  checkInDate: { lt: new Date(checkOut) },
                  checkOutDate: { gt: new Date(checkIn) },
                },
              },
            }
          : { status: "AVAILABLE" },
      },
    },
    orderBy: { basePrice: "asc" },
  });
}

async function FilterForm({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations("rooms");
  const selectedAmenities = searchParams.amenities?.split(",").filter(Boolean) ?? [];

  return (
    <form method="get" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="checkIn">{t("filterCheckIn")}</Label>
          <Input
            type="date"
            id="checkIn"
            name="checkIn"
            defaultValue={searchParams.checkIn ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut">{t("filterCheckOut")}</Label>
          <Input
            type="date"
            id="checkOut"
            name="checkOut"
            defaultValue={searchParams.checkOut ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">{t("filterMinCapacity")}</Label>
          <Input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="e.g. 2"
            min="1"
            defaultValue={searchParams.capacity ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("filterPriceRange")}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              name="minPrice"
              placeholder={t("filterMin")}
              min="0"
              defaultValue={searchParams.minPrice ?? ""}
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder={t("filterMax")}
              min="0"
              defaultValue={searchParams.maxPrice ?? ""}
            />
          </div>
        </div>
      </div>

      <input type="hidden" name="amenities" value={selectedAmenities.join(",")} />

      <div className="space-y-2">
        <Label>{t("filterAmenities")}</Label>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_AMENITIES.map((a) => {
            const Icon = a.icon;
            const checked = selectedAmenities.includes(a.value);
            const amenityLabel = t(`amenities.${a.labelKey}`);
            return (
              <label
                key={a.value}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  checked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => {
                    let next: string[];
                    if (e.target.checked) {
                      next = [...selectedAmenities, a.value];
                    } else {
                      next = selectedAmenities.filter((v) => v !== a.value);
                    }
                    const hidden = document.querySelector<HTMLInputElement>('input[name="amenities"]');
                    if (hidden) hidden.value = next.join(",");
                  }}
                />
                <Icon className="h-3.5 w-3.5" />
                {amenityLabel}
              </label>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" />
        {t("search")}
      </Button>
    </form>
  );
}

async function RoomList({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations("rooms");
  const roomTypes = await getAvailableRoomTypes(searchParams);

  if (roomTypes.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t("noResults")}
      </div>
    );
  }

  const checkInDate = searchParams.checkIn
    ? new Date(searchParams.checkIn)
    : new Date();

  const prices = await Promise.all(
    roomTypes.map((rt) =>
      calculateRoomPrice(Number(rt.basePrice), checkInDate, rt.id)
    )
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roomTypes.map((roomType, i) => {
        const finalPrice = prices[i];
        const basePrice = Number(roomType.basePrice);
        const hasSurge = finalPrice !== basePrice;

        return (
          <Card key={roomType.id}>
            <CardHeader>
              <CardTitle>{roomType.title}</CardTitle>
              <CardDescription>{roomType.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {hasSurge && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{t("perNight")}</span>
              </div>
              {hasSurge && (
                <Badge variant="secondary" className="text-xs">
                  {finalPrice > basePrice ? t("peakPricing") : t("offPeakPricing")}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {roomType.capacity} {roomType.capacity === 1 ? t("guest") : t("guests")}
                </Badge>
                <Badge variant="outline">
                  {roomType.rooms.length} {roomType.rooms.length === 1 ? t("roomAvailable") : t("roomsAvailable")}
                </Badge>
              </div>
              {roomType.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {roomType.amenities.slice(0, 4).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {roomType.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{roomType.amenities.length - 4} {t("more")}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" render={<Link href={`/rooms/${roomType.id}${searchParams.checkIn && searchParams.checkOut ? `?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}` : ""}`} />}>
                {t("viewDetails")}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("rooms");
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<div>{t("loadingFilters")}</div>}>
        <FilterForm searchParams={params} />
      </Suspense>

      <Suspense fallback={<div>{t("loadingRooms")}</div>}>
        <RoomList searchParams={params} />
      </Suspense>
    </div>
  );
}
