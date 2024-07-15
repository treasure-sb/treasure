"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { VendorBreakdownData } from "./VendorBreakdown";

const COLORS = ["#eac362", "#71d08c"];

export default function VendorsChart({
  vendorData,
}: {
  vendorData: VendorBreakdownData;
}) {
  const maxValue = vendorData.reduce(
    (max, item) => Math.max(max, item.vendors),
    0
  );

  const CustomBar = (props: any) => {
    const { x, y, width, height, name, index } = props;
    const color = COLORS[index % COLORS.length];
    const radius = 8;
    const opacity = 1;

    return (
      <g>
        <defs>
          <clipPath id={`clip-${name}`}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={radius}
              ry={radius}
            />
          </clipPath>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          fillOpacity={opacity}
          clipPath={`url(#clip-${name})`}
        />
      </g>
    );
  };

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          className="truncate text-sm"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={vendorData} layout="vertical">
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <XAxis hide dataKey="vendors" type="number" />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          tickSize={0}
          tickMargin={10}
          width={110}
          tick={<CustomYAxisTick />}
        />
        <Bar
          dataKey="vendors"
          layout="vertical"
          radius={5}
          shape={<CustomBar />}
        />
      </BarChart>
    </ResponsiveContainer>
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
