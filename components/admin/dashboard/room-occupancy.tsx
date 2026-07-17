"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const occupancyData = [
  { name: "Occupied", value: 92, count: 110 },
  { name: "Available", value: 8, count: 10 },
];

const totalRooms = 120;

export default function RoomOccupancy() {
  return (
    <Card className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-2 px-5 pt-5">
        <CardTitle className="text-base font-semibold">Room Occupancy</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex flex-col items-center">
          <div className="relative w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#4F6BF6" />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">92%</p>
            </div>
          </div>

          <div className="mt-6 w-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
              <span className="text-sm font-semibold">92% <span className="text-muted-foreground font-normal">({occupancyData[0].count})</span></span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <span className="text-sm font-semibold">8% <span className="text-muted-foreground font-normal">({occupancyData[1].count})</span></span>
            </div>
            <div className="border-t border-border pt-2.5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Rooms</span>
              <span className="text-sm font-bold">{totalRooms}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
