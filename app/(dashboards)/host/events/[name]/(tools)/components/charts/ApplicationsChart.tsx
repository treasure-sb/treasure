"use client";

import { ChartTooltip } from "@/components/ui/chart";
import { ApplicationData } from "./Applications";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Label } from "recharts";

const STATUS_COLORS = {
  PENDING: "#ffd65b",
  ACCEPTED: "#70cf8c",
  REJECTED: "#ff001b",
  WAITLISTED: "#c362dd",
};

export default function ApplicationsChart({
  applicationData,
}: {
  applicationData: ApplicationData;
}) {
  const totalApplications = applicationData.reduce(
    (sum, item) => sum + item.vendors,
    0
  );

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart width={730} height={250}>
        <ChartTooltip cursor={false} />
        <Pie
          data={applicationData}
          dataKey="vendors"
          nameKey="status"
          innerRadius={60}
          strokeWidth={0}
          fill="#8884d8"
        >
          {applicationData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ||
                "#8884d8"
              }
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalApplications}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-xs"
                    >
                      Applications
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
