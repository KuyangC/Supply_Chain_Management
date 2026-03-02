import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

/**
 * Trend type for showing directional indicators
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Props for SummaryCard component
 */
export interface SummaryCardProps {
  /**
   * Title/label for the card
   */
  title: string;
  /**
   * Main value to display
   */
  value: string | number;
  /**
   * Optional icon component
   */
  icon?: React.ComponentType<LucideProps>;
  /**
   * Optional trend information
   */
  trend?: {
    value: string;
    direction: TrendDirection;
  };
  /**
   * Optional CSS classes
   */
  className?: string;
  /**
   * Optional background color variant
   */
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

/**
 * Icon container styles by variant
 */
const iconVariantStyles = {
  default: "bg-blue-50 text-[#3b82f6]",
  success: "bg-green-50 text-[#10b981]",
  warning: "bg-amber-50 text-[#f59e0b]",
  danger: "bg-red-50 text-[#ef4444]",
  info: "bg-blue-50 text-[#3b82f6]",
};

/**
 * Trend color styles
 */
const trendStyles = {
  up: "text-[#10b981]",
  down: "text-[#ef4444]",
  neutral: "text-gray-500",
};

/**
 * SummaryCard Component
 *
 * Displays a summary statistic with white background, rounded corners, subtle shadow,
 * icon, title (gray), value (large black), and trend (green with arrow).
 *
 * @example
 * ```tsx
 * <SummaryCard
 *   title="Total Products"
 *   value={150}
 *   icon={Package}
 *   trend={{ value: "+12%", direction: "up" }}
 *   variant="default"
 * />
 * ```
 */
export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <p className={cn("mt-2 flex items-center text-sm font-medium", trendStyles[trend.direction])}>
                <TrendIcon direction={trend.direction} />
                <span className="ml-1">{trend.value}</span>
                <span className="ml-1 text-gray-400 font-normal">from last month</span>
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-xl p-3", iconVariantStyles[variant])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Trend icon component
 */
function TrendIcon({ direction }: { direction: TrendDirection }) {
  const IconComponent = {
    up: "M12 19V5M5 12l7-7 7 7",
    down: "M12 5v14M5 12l7 7 7-7",
    neutral: "M5 12h14",
  }[direction];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d={IconComponent} />
    </svg>
  );
}
