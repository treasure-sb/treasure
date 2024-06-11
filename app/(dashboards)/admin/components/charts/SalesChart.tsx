"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { SalesData } from "./SalesAnalytics";

export default function SalesChart({ salesData }: { salesData: SalesData }) {
  const maxValue = salesData.reduce(
    (max, item) => Math.max(max, Math.max(item.tables, item.tickets)),
    0
  );

  const formatTick = (value: string) => {
    return `$${value}`;
  };

  return (
    <div className="h-80 md:h-[29rem] col-span-2 bg-[#0d0d0c]/20 rounded-md p-6 border-2 border-secondary">
      <div className="flex space-x-2 items-end justify-between mb-4">
        <h3 className="text-2xl font-semibold">Sales Analytics</h3>
        <p className="text-sm md:text-base font-semibold text-muted-foreground">
          Last 30 days
        </p>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart width={500} height={300} data={salesData}>
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
            padding={{ left: 40 }}
            interval={3}
          />
          <YAxis
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            tickFormatter={formatTick}
            ticks={Array.from({ length: maxValue + 3 }, (_, i) => i)}
          />
          <Line type="monotone" dataKey="tables" stroke="#eac362" dot={false} />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#71d08c"
            dot={false}
          />
        </LineChart>
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
    const ticketSales = payload[0].payload.tickets;
    const tableSales = payload[0].payload.tables;
    const formattedDate = payload[0].payload.formattedDate;
    return (
      <div className="p-4 bg-background flex flex-col gap-4 rounded-md border-[1px]">
        <p className="text-medium text-lg">{formattedDate}</p>
        <p className="text-sm text-primary">
          Ticket Sales:
          <span className="ml-2">${ticketSales.toFixed(2)}</span>
        </p>
        <p className="text-sm text-tertiary">
          Table Sales:
          <span className="ml-2">${tableSales.toFixed(2)}</span>
        </p>
      </div>
    );
  }
};
