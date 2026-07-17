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
  icon: React.ReactNode;
  iconBg: string;
  sparkData: number[];
  sparkColor: string;
};

const stats: StatData[] = [
  {
    label: "Total Revenue",
    value: "$24,530",
    trend: "↑ 12% vs yesterday",
    icon: <DollarSign className="h-5 w-5" />,
    iconBg: "bg-blue-500",
    sparkData: [12, 19, 14, 22, 18, 25, 20],
    sparkColor: "#3b82f6",
  },
  {
    label: "Total Bookings",
    value: "148",
    trend: "↑ 16% vs yesterday",
    icon: <CalendarDays className="h-5 w-5" />,
    iconBg: "bg-emerald-500",
    sparkData: [8, 12, 10, 15, 13, 18, 16],
    sparkColor: "#10b981",
  },
  {
    label: "Occupancy Rate",
    value: "92%",
    trend: "↑ 4% vs yesterday",
    icon: <Bed className="h-5 w-5" />,
    iconBg: "bg-amber-500",
    sparkData: [85, 88, 90, 87, 92, 91, 92],
    sparkColor: "#f59e0b",
  },
  {
    label: "Guest Rating",
    value: "4.8 / 5",
    trend: "↑ 320 new reviews",
    icon: <Star className="h-5 w-5" />,
    iconBg: "bg-purple-500",
    sparkData: [4.5, 4.6, 4.7, 4.6, 4.8, 4.7, 4.8],
    sparkColor: "#a855f7",
  },
];

function SparkChart({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }));
  const gradientId = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function StatCards() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} text-white shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold tracking-tight mb-2">{stat.value}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {stat.trend}
            </div>
            <div className="mt-3 -mx-1">
              <SparkChart data={stat.sparkData} color={stat.sparkColor} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
