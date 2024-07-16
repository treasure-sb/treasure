"use client";

import { ChartTooltip } from "@/components/ui/chart";
import { ApplicationData } from "./VendorBreakdown";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Label } from "recharts";
import { useEffect, useRef, useState } from "react";

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) / 2;
  const innerRadius = Math.max(radius * 0.5, 30);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart width={730} height={250}>
          <ChartTooltip cursor={false} />
          <Pie
            data={applicationData}
            dataKey="vendors"
            nameKey="status"
            innerRadius={innerRadius}
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
                        className="fill-muted-foreground text-sm hidden 3xl:block"
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
    </div>
  );
}
