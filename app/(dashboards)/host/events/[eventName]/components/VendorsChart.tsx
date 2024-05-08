"use client";

import {
  BarChart,
  Bar,
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
import { VendorBreakdownData } from "./VendorBreakdown";

export default function VendorsChart({
  vendorData,
}: {
  vendorData: VendorBreakdownData;
}) {
  const maxValue = vendorData.reduce(
    (max, item) => Math.max(max, item.vendors),
    0
  );

  return (
    <div className="h-80 md:h-[32rem] col-span-2 bg-[#0d0d0c]/20 rounded-md p-6 border-2 border-secondary">
      <h3 className="text-2xl font-semibold mb-4">Vendor Breakdown</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={vendorData}>
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
          <YAxis
            axisLine={false}
            tickSize={0}
            tickMargin={16}
            ticks={Array.from({ length: maxValue + 3 }, (_, i) => i)}
          />
          <Bar
            type="monotone"
            dataKey="vendors"
            fill="#71d08c"
            radius={[20, 20, 0, 0]}
          />
        </BarChart>
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
          Vendors:
          <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }
};
