"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Data structure for inventory flow
 */
interface InventoryFlowData {
  month: string;
  inbound: number;
  outbound: number;
}

/**
 * Props for InventoryFlowChart component
 */
export interface InventoryFlowChartProps {
  /**
   * Optional custom data
   */
  data?: InventoryFlowData[];
  /**
   * Optional CSS classes
   */
  className?: string;
}

/**
 * Default mock data for inventory flow trend
 */
const defaultData: InventoryFlowData[] = [
  { month: "Aug", inbound: 12000, outbound: 8500 },
  { month: "Sep", inbound: 14500, outbound: 11000 },
  { month: "Oct", inbound: 16000, outbound: 12500 },
  { month: "Nov", inbound: 14000, outbound: 15000 },
  { month: "Dec", inbound: 17500, outbound: 14000 },
  { month: "Jan", inbound: 15000, outbound: 13000 },
  { month: "Feb", inbound: 16500, outbound: 14500 },
];

/**
 * Custom tooltip component
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-900">{payload[0].payload.month}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * Custom legend component
 */
function CustomLegend() {
  return (
    <div className="flex justify-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded" style={{ backgroundColor: "#3b82f6" }} />
        <span className="text-gray-600">Inbound</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded" style={{ backgroundColor: "#94a3b8" }} />
        <span className="text-gray-600">Outbound</span>
      </div>
    </div>
  );
}

/**
 * InventoryFlowChart Component
 *
 * Bar chart showing inbound vs outbound inventory over time.
 * Features:
 * - Responsive design using Recharts ResponsiveContainer
 * - X-axis: Months (Aug, Sep, Oct, Nov, Dec, Jan, Feb)
 * - Y-axis: 0k - 18k
 * - Blue bars (#3b82f6) for inbound
 * - Gray bars (#94a3b8) for outbound
 * - Custom styled tooltip
 * - Custom legend
 *
 * @example
 * ```tsx
 * <InventoryFlowChart />
 * ```
 *
 * @example
 * ```tsx
 * <InventoryFlowChart
 *   data={[
 *     { month: "Jan", inbound: 15000, outbound: 13000 },
 *     { month: "Feb", inbound: 16500, outbound: 14500 },
 *   ]}
 * />
 * ```
 */
export function InventoryFlowChart({
  data = defaultData,
  className,
}: InventoryFlowChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
            domain={[0, 18000]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} />
          <Legend content={<CustomLegend />} />
          <Bar
            dataKey="inbound"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="outbound"
            fill="#94a3b8"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
