import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import PricingManager from "@/components/admin/pricing-manager";

export const metadata: Metadata = {
  title: "Admin — Pricing Overrides",
};

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

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
        <h1 className="font-heading text-2xl">Pricing Overrides</h1>
        <p className="text-muted-foreground">
          Set per-date price overrides that bypass seasonal and occupancy calculations.
        </p>
      </div>
      <PricingManager roomTypes={serialized} />
    </div>
  );
}
