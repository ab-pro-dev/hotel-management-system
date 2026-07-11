import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Rooms",
  description: "Browse available room types and book your stay.",
};

type SearchParams = {
  checkIn?: string;
  checkOut?: string;
  capacity?: string;
  minPrice?: string;
  maxPrice?: string;
};

async function getAvailableRoomTypes(searchParams: SearchParams) {
  const { checkIn, checkOut, capacity, minPrice, maxPrice } = searchParams;

  const where: Record<string, unknown> = {};

  if (capacity) {
    where.capacity = { gte: parseInt(capacity, 10) };
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) (where.basePrice as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.basePrice as Record<string, number>).lte = parseFloat(maxPrice);
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

function FilterForm({ searchParams }: { searchParams: SearchParams }) {
  return (
    <form method="get" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="checkIn">Check-in</Label>
        <Input
          type="date"
          id="checkIn"
          name="checkIn"
          defaultValue={searchParams.checkIn ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOut">Check-out</Label>
        <Input
          type="date"
          id="checkOut"
          name="checkOut"
          defaultValue={searchParams.checkOut ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacity">Min Capacity</Label>
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
        <Label>Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Min"
            min="0"
            defaultValue={searchParams.minPrice ?? ""}
          />
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max"
            min="0"
            defaultValue={searchParams.maxPrice ?? ""}
          />
        </div>
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}

async function RoomList({ searchParams }: { searchParams: SearchParams }) {
  const roomTypes = await getAvailableRoomTypes(searchParams);

  if (roomTypes.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No room types available matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roomTypes.map((roomType) => (
        <Card key={roomType.id}>
          <CardHeader>
            <CardTitle>{roomType.title}</CardTitle>
            <CardDescription>{roomType.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                ${roomType.basePrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">per night</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Up to {roomType.capacity} {roomType.capacity === 1 ? "guest" : "guests"}
              </Badge>
              <Badge variant="outline">
                {roomType.rooms.length} {roomType.rooms.length === 1 ? "room" : "rooms"} available
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" render={<Link href={`/rooms/${roomType.id}${searchParams.checkIn && searchParams.checkOut ? `?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}` : ""}`} />}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Discover Rooms</h1>
        <p className="text-muted-foreground">
          Find the perfect room for your stay.
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterForm searchParams={params} />
      </Suspense>

      <Suspense fallback={<div>Loading rooms...</div>}>
        <RoomList searchParams={params} />
      </Suspense>
    </div>
  );
}
