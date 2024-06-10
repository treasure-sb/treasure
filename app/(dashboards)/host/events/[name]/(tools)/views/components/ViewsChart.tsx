"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  AreaChart,
  Area,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { ViewsChartData } from "../page";

export default function ViewsChart({ data }: { data: ViewsChartData }) {
  const maxValue = data.reduce(
    (max, item) => Math.max(max, Math.max(item.views)),
    0
  );

  return (
    <div className="h-[30rem] bg-[#0d0d0c]/20 rounded-md p-6 border-2 border-secondary">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={500} height={300} data={data}>
          <CartesianGrid
            strokeDasharray="4 1"
            stroke="#27272a"
            vertical={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            ticks={Array.from({ length: maxValue + 3 }, (_, i) => i)}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#71d08c"
            fill="#71d08c"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const views = payload[0].payload.views;
    const formattedDate = payload[0].payload.formattedDate;

    return (
      <div className="p-4 bg-background flex flex-col gap-2 rounded-md border-[1px]">
        <p className="text-base">
          Page Views
          <span className="ml-2 bg-secondary rounded-none p-1">{views}</span>
        </p>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    );
  }
};
