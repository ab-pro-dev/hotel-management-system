import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roomType = await prisma.roomType.findUnique({ where: { id } });
  if (!roomType) return { title: "Room Not Found" };
  return { title: roomType.title, description: roomType.description };
}

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { checkIn, checkOut } = await searchParams;

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
        Back to rooms
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{roomType.title}</CardTitle>
          <CardDescription className="text-base">{roomType.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-3xl font-bold">${roomType.basePrice.toFixed(2)}</span>
              <span className="ml-1 text-muted-foreground">per night</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Up to {roomType.capacity} {roomType.capacity === 1 ? "guest" : "guests"}
            </Badge>
            <Badge variant="outline">
              {availableRooms.length} {availableRooms.length === 1 ? "room" : "rooms"} available
            </Badge>
          </div>

          {checkIn && checkOut && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Selected dates</p>
              <p className="font-medium">
                {new Date(checkIn).toLocaleDateString()} — {new Date(checkOut).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" render={<Link href={bookHref} />}>
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
