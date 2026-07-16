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
  { date: "Mon", revenue: 12400, fullDate: "May 22, 2026" },
  { date: "Tue", revenue: 15800, fullDate: "May 23, 2026" },
  { date: "Wed", revenue: 18200, fullDate: "May 24, 2026" },
  { date: "Thu", revenue: 14500, fullDate: "May 25, 2026" },
  { date: "Fri", revenue: 20430, fullDate: "May 26, 2026" },
  { date: "Sat", revenue: 22100, fullDate: "May 27, 2026" },
  { date: "Sun", revenue: 19800, fullDate: "May 28, 2026" },
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
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="text-xs text-muted-foreground mb-1">{data.fullDate}</p>
      <p className="text-sm font-bold">${data.revenue.toLocaleString()}</p>
    </div>
  );
}

export default function RevenueChart() {
  const [period, setPeriod] = useState("week");
  const data = period === "week" ? weekData : monthData;

  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
        <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F6BF6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4F6BF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4F6BF6"
              strokeWidth={2.5}
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
