"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weekData = [
  { date: "May 24", revenue: 8200, fullDate: "May 24, 2026" },
  { date: "May 25", revenue: 12400, fullDate: "May 25, 2026" },
  { date: "May 26", revenue: 15800, fullDate: "May 26, 2026" },
  { date: "May 27", revenue: 11200, fullDate: "May 27, 2026" },
  { date: "May 28", revenue: 20430, fullDate: "May 28, 2026" },
  { date: "May 29", revenue: 17600, fullDate: "May 29, 2026" },
  { date: "May 30", revenue: 22100, fullDate: "May 30, 2026" },
];

const monthData = [
  { date: "Week 1", revenue: 82400, fullDate: "Week 1" },
  { date: "Week 2", revenue: 95800, fullDate: "Week 2" },
  { date: "Week 3", revenue: 88200, fullDate: "Week 3" },
  { date: "Week 4", revenue: 102430, fullDate: "Week 4" },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { fullDate: string; revenue: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{data.fullDate}</p>
      <p className="text-sm font-bold">${data.revenue.toLocaleString()}</p>
    </div>
  );
}

export default function RevenueChart() {
  const [period, setPeriod] = useState("week");
  const data = period === "week" ? weekData : monthData;

  return (
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-5 pt-5">
        <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
        <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
          <SelectTrigger className="w-[120px] h-8 text-xs rounded-lg border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F6BF6" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#4F6BF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4F6BF6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#4F6BF6", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
