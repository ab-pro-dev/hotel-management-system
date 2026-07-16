"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const occupancyData = [
  { name: "Occupied", value: 92, count: 46 },
  { name: "Available", value: 8, count: 4 },
];



export default function RoomOccupancy() {
  return (
    <Card className="rounded-2xl shadow-sm border-0 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Room Occupancy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {occupancyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      className="fill-card dark:fill-card"
                      style={{
                        fill: index === 0 ? "#4F6BF6" : undefined,
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">92%</p>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </div>
          </div>

          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
              <span className="text-sm font-medium">46 rooms</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <span className="text-sm font-medium">4 rooms</span>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Rooms</span>
              <span className="text-sm font-bold">50</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
