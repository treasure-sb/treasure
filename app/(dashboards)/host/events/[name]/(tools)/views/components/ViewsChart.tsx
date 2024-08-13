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
import { format, parseISO } from "date-fns";

export default function ViewsChart({
  data,
  period,
}: {
  data: ViewsChartData;
  period?: string;
}) {
  const formatTick = (day: string) => {
    return format(parseISO(day), "M/d");
  };

  const maxValue = Math.max(...data.map((d) => d.views));

  return (
    <div className="h-[30rem] bg-slate-100 dark:bg-[#0d0d0c] rounded-md p-6 border-2 border-secondary">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={500} height={300} data={data}>
          <CartesianGrid
            strokeDasharray="4 1"
            stroke="#27272a"
            vertical={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <XAxis
            dataKey="normalizedDate"
            axisLine={false}
            tickSize={0}
            interval={period === "30d" ? 6 : 0}
            tickMargin={16}
            tickFormatter={formatTick}
          />
          <YAxis
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            dataKey="day"
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
          <span className="ml-2 bg-secondary rounded-[3px] p-1">{views}</span>
        </p>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    );
  }
};
