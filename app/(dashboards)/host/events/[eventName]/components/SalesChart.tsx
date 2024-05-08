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

const salesData = [
  {
    name: "Jan",
    revenue: 4000,
    profit: 2400,
  },
  {
    name: "Feb",
    revenue: 3000,
    profit: 1398,
  },
  {
    name: "Mar",
    revenue: 9800,
    profit: 2000,
  },
  {
    name: "Apr",
    revenue: 3908,
    profit: 2780,
  },
  {
    name: "May",
    revenue: 4800,
    profit: 1890,
  },
  {
    name: "Jun",
    revenue: 3800,
    profit: 2390,
  },
];

export default function SalesChart() {
  return (
    <div className="h-80 md:h-[32rem] col-span-2 bg-[#0d0d0c]/20 rounded-md p-6 border-2 border-secondary">
      <h3 className="text-2xl font-semibold mb-4">Sales Analytics</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart width={500} height={300} data={salesData}>
          <CartesianGrid
            strokeDasharray="4 1"
            stroke="#27272a"
            vertical={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            padding={{ left: 40 }}
          />
          <YAxis axisLine={false} tickSize={0} tickMargin={16} />
          <Line
            type="monotone"
            dataKey="revenue"
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
    return (
      <div className="p-4 bg-background flex flex-col gap-4 rounded-md border-[1px]">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-primary">
          Revenue:
          <span className="ml-2">${payload[0].value}</span>
        </p>
      </div>
    );
  }
};
