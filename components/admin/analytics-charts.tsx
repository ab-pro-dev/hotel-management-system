"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type OccupancyPoint = { date: string; occupancy: number };
type RevenueSource = { source: string; amount: number };
type YieldMetrics = {
  adr: number;
  revpar: number;
  totalRevenue: number;
  roomsSold: number;
  availableRooms: number;
};
type PopularityPoint = { roomType: string; bookings: number };

const PIE_COLORS = ["oklch(0.58 0.08 65)", "oklch(0.52 0.01 55)"];

function OccupancyChart({ data }: { data: OccupancyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Trend (30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(v: string) => v.slice(5)}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="occupancy"
              stroke="oklch(0.58 0.08 65)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function RevenueChart({ data }: { data: RevenueSource[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown (30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function PopularityChart({ data }: { data: PopularityPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Type Popularity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="roomType" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="bookings" fill="oklch(0.58 0.08 65)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsCharts({
  occupancy,
  revenue,
  metrics,
  popularity,
}: {
  occupancy: OccupancyPoint[];
  revenue: RevenueSource[];
  metrics: YieldMetrics;
  popularity: PopularityPoint[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          title="Average Daily Rate"
          value={`$${metrics.adr.toFixed(2)}`}
          subtitle={`${metrics.roomsSold} rooms sold`}
        />
        <MetricCard
          title="RevPAR"
          value={`$${metrics.revpar.toFixed(2)}`}
          subtitle={`${metrics.availableRooms} total rooms`}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <OccupancyChart data={occupancy} />
        <RevenueChart data={revenue} />
      </div>
      <PopularityChart data={popularity} />
    </div>
  );
}
