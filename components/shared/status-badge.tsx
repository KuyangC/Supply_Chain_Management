import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  SHIPMENT_STATUS_CONFIG,
  PRODUCT_STATUS_CONFIG,
  USER_STATUS_CONFIG,
} from "@/lib/constants";

/**
 * Status configuration type
 */
interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

/**
 * Status options for different entity types
 */
type StatusType = "shipment" | "product" | "user";
type StatusValue = keyof typeof SHIPMENT_STATUS_CONFIG &
  keyof typeof PRODUCT_STATUS_CONFIG &
  keyof typeof USER_STATUS_CONFIG;

/**
 * Props for StatusBadge component
 */
export interface StatusBadgeProps {
  /**
   * The status value (e.g., "pending", "in_transit", "active")
   */
  status: string;
  /**
   * The type of entity (shipment, product, user)
   */
  type?: StatusType;
  /**
   * Custom label override
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Get the status configuration based on type and status value
 */
function getStatusConfig(type: StatusType, status: string): StatusConfig {
  switch (type) {
    case "shipment":
      return (
        SHIPMENT_STATUS_CONFIG[status as keyof typeof SHIPMENT_STATUS_CONFIG] ||
        {
          label: status,
          color: "gray",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        }
      );
    case "product":
      return (
        PRODUCT_STATUS_CONFIG[status as keyof typeof PRODUCT_STATUS_CONFIG] ||
        {
          label: status,
          color: "gray",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        }
      );
    case "user":
      return (
        USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG] || {
          label: status,
          color: "gray",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        }
      );
    default:
      return {
        label: status,
        color: "gray",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
  }
}

/**
 * StatusBadge Component
 *
 * Displays a status badge with appropriate color coding based on the Figma design:
 * - Blue for in transit
 * - Green for delivered/active
 * - Amber for picked up
 * - Gray for pending
 *
 * @example
 * ```tsx
 * <StatusBadge status="in_transit" type="shipment" />
 * <StatusBadge status="active" type="product" />
 * <StatusBadge status="suspended" type="user" label="Suspended" />
 * ```
 */
export function StatusBadge({
  status,
  type = "shipment",
  label,
  className,
}: StatusBadgeProps) {
  const config = getStatusConfig(type, status);

  return (
    <Badge
      className={cn(
        "px-2.5 py-0.5 text-xs font-medium rounded-full",
        config.bgColor,
        config.textColor,
        className
      )}
      variant="outline"
    >
      {label || config.label}
    </Badge>
  );
}
