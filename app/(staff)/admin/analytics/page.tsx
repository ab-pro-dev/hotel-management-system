import { Metadata } from "next";
import {
  getOccupancyTrend,
  getRevenueBreakdown,
  getYieldMetrics,
} from "@/lib/analytics";
import AnalyticsCharts from "@/components/admin/analytics-charts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const [occupancy, revenue, metrics] = await Promise.all([
    getOccupancyTrend(30),
    getRevenueBreakdown(),
    getYieldMetrics(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Revenue and occupancy insights.</p>
      </div>
      <AnalyticsCharts occupancy={occupancy} revenue={revenue} metrics={metrics} />
    </div>
  );
}
