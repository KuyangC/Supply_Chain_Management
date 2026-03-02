"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * Shipment status data structure
 */
export interface ShipmentStatusData {
  status: string;
  count: number;
  color: string;
}

/**
 * Props for ShipmentStatusChart component
 */
export interface ShipmentStatusChartProps {
  /**
   * Optional custom data
   */
  data?: ShipmentStatusData[];
  /**
   * Optional CSS classes
   */
  className?: string;
}

/**
 * Default shipment status data
 */
const defaultData: ShipmentStatusData[] = [
  { status: "Delivered", count: 450, color: "#10b981" },
  { status: "In Transit", count: 120, color: "#3b82f6" },
  { status: "Pending", count: 80, color: "#6b7280" },
  { status: "Failed", count: 15, color: "#ef4444" },
];

/**
 * Custom tooltip component
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-900">{data.status}</p>
        <p className="text-sm" style={{ color: data.color }}>
          {data.count} shipments
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Custom legend item component
 */
interface LegendItemProps {
  data: ShipmentStatusData;
  total: number;
}

function LegendItem({ data, total }: LegendItemProps) {
  const percentage = ((data.count / total) * 100).toFixed(1);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm text-gray-600">{data.status}</span>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-900">{data.count}</span>
        <span className="ml-1 text-xs text-gray-400">({percentage}%)</span>
      </div>
    </div>
  );
}

/**
 * ShipmentStatusChart Component
 *
 * Donut chart showing shipment status distribution.
 * Features:
 * - Responsive design using Recharts ResponsiveContainer
 * - Data segments:
 *   - Delivered: 450 (green #10b981)
 *   - In Transit: 120 (blue #3b82f6)
 *   - Pending: 80 (gray #6b7280)
 *   - Failed: 15 (red #ef4444)
 * - Custom styled tooltip
 * - Legend with colors, counts, and percentages
 * - Donut chart with configurable inner radius
 *
 * @example
 * ```tsx
 * <ShipmentStatusChart />
 * ```
 *
 * @example
 * ```tsx
 * <ShipmentStatusChart
 *   data={[
 *     { status: "Delivered", count: 500, color: "#10b981" },
 *     { status: "In Transit", count: 100, color: "#3b82f6" },
 *   ]}
 * />
 * ```
 */
export function ShipmentStatusChart({
  data = defaultData,
  className,
}: ShipmentStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={2}
              dataKey="count"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex-1">
          {data.map((item) => (
            <LegendItem key={item.status} data={item} total={total} />
          ))}
        </div>
      </div>
    </div>
  );
}
