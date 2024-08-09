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
import { type RevenueData } from "./Revenue";
import { format, parseISO } from "date-fns";
import { USDollar } from "@/lib/utils";

export default function RevenueChart({
  revenueData,
  periodLength,
}: {
  revenueData: RevenueData[];
  periodLength: number;
}) {
  const maxValue = revenueData.reduce(
    (max, item) => Math.max(max, Math.max(item.amount)),
    0
  );

  const getTickInterval = (max: number) => {
    if (max <= 1) return 0.25;
    if (max <= 5) return 1;
    if (max <= 10) return 2;
    if (max <= 100) return 20;
    if (max <= 300) return 50;
    if (max <= 500) return 100;
    if (max <= 1000) return 200;
    return Math.pow(10, Math.floor(Math.log10(max)) - 1);
  };

  const tickInterval = getTickInterval(maxValue);
  const maxYValue =
    maxValue < 1
      ? Math.ceil(maxValue / 0.25) * 0.25
      : Math.ceil(maxValue / tickInterval) * tickInterval;

  const yAxisTicks = Array.from(
    { length: Math.max(Math.floor(maxYValue / tickInterval) + 1, 4) },
    (_, i) => Number((i * tickInterval).toFixed(2))
  );

  const formatYTick = (value: string) => {
    return `$${value}`;
  };

  const formatXTick = (day: string) => {
    return format(parseISO(day), "M/d");
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart width={500} height={300} data={revenueData}>
        <CartesianGrid
          strokeDasharray="4 1"
          stroke="#27272a"
          vertical={false}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <XAxis
          dataKey="normalizedDate"
          axisLine={false}
          tickSize={0}
          tickMargin={16}
          padding={{ left: 40 }}
          tickFormatter={formatXTick}
          interval={periodLength === 7 ? 0 : 3}
        />
        <YAxis
          axisLine={false}
          tickSize={0}
          tickMargin={16}
          tickFormatter={formatYTick}
          ticks={yAxisTicks}
          domain={[0, Math.max(maxYValue, 1)]}
        />
        <Area
          type="monotone"
          dataKey="amount"
          fill="#71d08c"
          stroke="#71d08c"
          dot={false}
          fillOpacity={0.4}
          stackId={"a"}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const amount = payload[0].payload.amount;
    const formattedDate = payload[0].payload.formattedDate;
    return (
      <div className="p-4 bg-background flex flex-col gap-2 rounded-md border-[1px]">
        <p className="text-base">Revenue</p>
        <p className="text-base">{USDollar.format(amount)}</p>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    );
  }
};
