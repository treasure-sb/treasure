"use client";

import { ChartTooltip } from "@/components/ui/chart";
import { ApplicationData } from "./VendorBreakdown";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Label } from "recharts";
import { useEffect, useRef, useState } from "react";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { capitalize, cn } from "@/lib/utils";
import { useViewportSize } from "@mantine/hooks";

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
  const { width } = useViewportSize();
  const totalApplications = applicationData.reduce(
    (sum, item) => sum + item.vendors,
    0
  );

  const isDataEmpty = totalApplications === 0;

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
  const innerRadius = Math.max(radius * (width < 640 ? 0.1 : 0.5), 30);

  return (
    <div ref={containerRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="90%">
        <PieChart width={730} height={250}>
          {!isDataEmpty && (
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
          )}
          <Pie
            data={isDataEmpty ? [{ vendors: 1 }] : applicationData}
            dataKey="vendors"
            nameKey="status"
            innerRadius={innerRadius}
            strokeWidth={0}
            fill={isDataEmpty ? "#27272a" : "#8884d8"}
          >
            {isDataEmpty ? (
              <Cell fill="#27272a" opacity={0.8} />
            ) : (
              applicationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ||
                    "#8884d8"
                  }
                />
              ))
            )}
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
                        className={cn(
                          "fill-foreground",
                          isDataEmpty
                            ? "text-base font-normal hidden 3xl:block"
                            : "text-3xl font-bold"
                        )}
                      >
                        {isDataEmpty ? "No Applications" : totalApplications}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-sm hidden 3xl:block"
                      >
                        {isDataEmpty ? "" : "Applications"}
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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const name = payload?.[0]?.name;
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background flex flex-col space-y-2 rounded-md border-[1px]">
        <p className="text-sm">
          {capitalize(name?.toString().toLowerCase() || "")}
          <span
            className={cn(
              "ml-2 p-1 rounded-[3px] text-foreground",
              name === "PENDING"
                ? "bg-tertiary/10 text-yellow-500"
                : name === "ACCEPTED"
                ? "bg-primary/10 text-green-500"
                : "bg-red-600/10 text-red-500"
            )}
          >
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
};
