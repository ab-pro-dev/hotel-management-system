import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import PricingManager from "@/components/admin/pricing-manager";

export const metadata: Metadata = {
  title: "Admin — Pricing Overrides",
};

export default async function PricingPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const roomTypes = await prisma.roomType.findMany({
    select: { id: true, title: true, basePrice: true },
    orderBy: { title: "asc" },
  });

  const serialized = roomTypes.map((rt) => ({
    ...rt,
    basePrice: Number(rt.basePrice),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing Overrides</h1>
        <p className="text-muted-foreground">
          Set per-date price overrides that bypass seasonal and occupancy calculations.
        </p>
      </div>
      <PricingManager roomTypes={serialized} />
    </div>
  );
}
