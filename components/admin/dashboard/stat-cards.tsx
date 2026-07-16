"use client";

import { DollarSign, CalendarDays, Bed, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

type StatData = {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
  sparkData: number[];
};

const stats: StatData[] = [
  {
    label: "Total Revenue",
    value: "$24,530",
    trend: "↑ 12% vs yesterday",
    trendUp: true,
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    sparkData: [12, 19, 14, 22, 18, 25, 20],
  },
  {
    label: "Total Bookings",
    value: "184",
    trend: "↑ 8% vs yesterday",
    trendUp: true,
    icon: <CalendarDays className="h-5 w-5" />,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    sparkData: [8, 12, 10, 15, 13, 18, 16],
  },
  {
    label: "Occupancy Rate",
    value: "92%",
    trend: "↑ 3% vs yesterday",
    trendUp: true,
    icon: <Bed className="h-5 w-5" />,
    color: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    sparkData: [85, 88, 90, 87, 92, 91, 92],
  },
  {
    label: "Guest Rating",
    value: "4.8",
    trend: "↑ 0.2 vs last week",
    trendUp: true,
    icon: <Star className="h-5 w-5" />,
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    sparkData: [4.5, 4.6, 4.7, 4.6, 4.8, 4.7, 4.8],
  },
];

const sparkColors = [
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#a855f7",
];

function SparkChart({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function StatCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={stat.label} className="rounded-2xl shadow-sm border-0 bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <div className="mt-3">
              <SparkChart data={stat.sparkData} color={sparkColors[i]} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
