import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getOccupancyTrend,
  getRevenueBreakdown,
  getYieldMetrics,
  getPopularityMatrix,
} from "@/lib/analytics";
import AnalyticsCharts from "@/components/admin/analytics-charts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect(`/${locale}/login`);

  const [occupancy, revenue, metrics, popularity] = await Promise.all([
    getOccupancyTrend(30),
    getRevenueBreakdown(),
    getYieldMetrics(),
    getPopularityMatrix(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl">Analytics</h1>
        <p className="text-muted-foreground">Revenue and occupancy insights.</p>
      </div>
      <AnalyticsCharts
        occupancy={occupancy}
        revenue={revenue}
        metrics={metrics}
        popularity={popularity}
      />
    </div>
  );
}
