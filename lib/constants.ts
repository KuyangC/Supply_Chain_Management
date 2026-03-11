/**
 * Shared Constants for Supply Chain Tracking System
 */

/**
 * Navigation menu items
 */
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
  },
  {
    title: "Products",
    href: "/products",
    icon: "Package",
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: "Warehouse",
  },
  {
    title: "Shipments",
    href: "/shipments",
    icon: "Truck",
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: "Building",
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: "ArrowRight",
  },
  {
    title: "Returns",
    href: "/returns",
    icon: "RotateCcw",
  },
  {
    title: "Users",
    href: "/users",
    icon: "Users",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
  },
  {
    title: "Event Logs",
    href: "/event-logs",
    icon: "ScrollText",
  },
] as const;

/**
 * System menu items (Settings, Logout)
 */
export const SYSTEM_ITEMS = [
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
  {
    title: "Logout",
    href: "#",
    icon: "LogOut",
    action: "logout",
  },
] as const;

/**
 * Shipment status configuration with colors
 * Figma colors: blue (#3b82f6) for in transit, green (#10b981) for delivered,
 * amber (#f59e0b) for picked up, gray for pending
 */
export const SHIPMENT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  confirmed: {
    label: "Confirmed",
    color: "blue" as const,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  picked_up: {
    label: "Picked Up",
    color: "amber" as const,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  in_transit: {
    label: "In Transit",
    color: "blue" as const,
    bgColor: "bg-[#dbeafe]",
    textColor: "text-[#1d4ed8]",
  },
  delivered: {
    label: "Delivered",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  failed: {
    label: "Failed",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  cancelled: {
    label: "Cancelled",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
} as const;

/**
 * Product status configuration
 */
export const PRODUCT_STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  inactive: {
    label: "Inactive",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  discontinued: {
    label: "Discontinued",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
} as const;

/**
 * User role configuration
 */
export const USER_ROLES = {
  admin: "Admin",
  manager: "Manager",
  operator: "Operator",
  viewer: "Viewer",
} as const;

/**
 * User status configuration
 */
export const USER_STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  inactive: {
    label: "Inactive",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  suspended: {
    label: "Suspended",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
} as const;

/**
 * Adjustment types configuration
 */
export const ADJUSTMENT_TYPES = {
  increase: "Increase",
  decrease: "Decrease",
  damage: "Damage",
  loss: "Loss",
} as const;

/**
 * Common unit options
 */
export const UNIT_OPTIONS = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "lb", label: "Pounds" },
  { value: "oz", label: "Ounces" },
  { value: "L", label: "Liters" },
  { value: "mL", label: "Milliliters" },
  { value: "gal", label: "Gallons" },
  { value: "m", label: "Meters" },
  { value: "cm", label: "Centimeters" },
  { value: "ft", label: "Feet" },
  { value: "in", label: "Inches" },
  { value: "box", label: "Box" },
  { value: "carton", label: "Carton" },
  { value: "pallet", label: "Pallet" },
  { value: "bag", label: "Bag" },
] as const;

/**
 * Common category options
 */
export const CATEGORY_OPTIONS = [
  { value: "electronics", label: "Electronics" },
  { value: "food", label: "Food & Beverages" },
  { value: "clothing", label: "Clothing & Apparel" },
  { value: "health", label: "Health & Beauty" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "toys", label: "Toys & Games" },
  { value: "automotive", label: "Automotive" },
  { value: "office", label: "Office Supplies" },
  { value: "industrial", label: "Industrial" },
  { value: "medical", label: "Medical Supplies" },
  { value: "other", label: "Other" },
] as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Date range presets for analytics
 */
export const DATE_RANGE_PRESETS = [
  { label: "Today", value: "today", days: 0 },
  { label: "Last 7 Days", value: "7d", days: 7 },
  { label: "Last 30 Days", value: "30d", days: 30 },
  { label: "Last 90 Days", value: "90d", days: 90 },
  { label: "This Month", value: "thisMonth", days: 0 },
  { label: "Last Month", value: "lastMonth", days: 0 },
  { label: "This Year", value: "thisYear", days: 0 },
] as const;

/**
 * Export format options
 */
export const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF", icon: "file-text" },
  { value: "xlsx", label: "Excel", icon: "sheet" },
  { value: "csv", label: "CSV", icon: "table" },
] as const;

/**
 * Supplier status configuration
 */
export const SUPPLIER_STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  inactive: {
    label: "Inactive",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  blocked: {
    label: "Blocked",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
} as const;

/**
 * Stock transfer status configuration
 */
export const TRANSFER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  in_transit: {
    label: "In Transit",
    color: "blue" as const,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  completed: {
    label: "Completed",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  failed: {
    label: "Failed",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
} as const;

/**
 * Return status configuration
 */
export const RETURN_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  approved: {
    label: "Approved",
    color: "blue" as const,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  rejected: {
    label: "Rejected",
    color: "red" as const,
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  completed: {
    label: "Completed",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  refunded: {
    label: "Refunded",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
} as const;

/**
 * Location type configuration
 */
export const LOCATION_TYPE_CONFIG = {
  supplier: {
    label: "Supplier",
    color: "purple" as const,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    icon: "Building",
  },
  manufacturer: {
    label: "Manufaktur",
    color: "blue" as const,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: "Factory",
  },
  warehouse: {
    label: "Warehouse",
    color: "orange" as const,
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    icon: "Warehouse",
  },
  distributor: {
    label: "Distributor",
    color: "cyan" as const,
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    icon: "Truck",
  },
  retail: {
    label: "Retail",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: "Store",
  },
} as const;

/**
 * Product type configuration
 */
export const PRODUCT_TYPE_CONFIG = {
  raw: {
    label: "Raw Material",
    color: "amber" as const,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  finished: {
    label: "Finished Goods",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
} as const;

/**
 * Production batch status configuration
 */
export const PRODUCTION_BATCH_STATUS_CONFIG = {
  raw_material: {
    label: "Raw Material",
    color: "amber" as const,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  in_production: {
    label: "In Production",
    color: "blue" as const,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  finished: {
    label: "Finished",
    color: "green" as const,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  packed: {
    label: "Packed",
    color: "purple" as const,
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  shipped: {
    label: "Shipped",
    color: "gray" as const,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
} as const;

/**
 * Navigation menu items by location type
 */
export const NAV_ITEMS_BY_LOCATION = {
  supplier: [
    { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { title: "Stock", href: "/inventory", icon: "Package" },
    { title: "Shipments", href: "/shipments", icon: "Truck" },
    { title: "Search", href: "/search", icon: "Search" },
    { title: "Logs", href: "/event-logs", icon: "ScrollText" },
  ] as const,
  manufacturer: [
    { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { title: "Stock", href: "/inventory", icon: "Package" },
    { title: "Production", href: "/production", icon: "Factory" },
    { title: "Shipments", href: "/shipments", icon: "Truck" },
    { title: "Search", href: "/search", icon: "Search" },
    { title: "Logs", href: "/event-logs", icon: "ScrollText" },
  ] as const,
  warehouse: [
    { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { title: "Stock", href: "/inventory", icon: "Package" },
    { title: "Shipments", href: "/shipments", icon: "Truck" },
    { title: "Search", href: "/search", icon: "Search" },
    { title: "Logs", href: "/event-logs", icon: "ScrollText" },
  ] as const,
  distributor: [
    { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { title: "Stock", href: "/inventory", icon: "Package" },
    { title: "Shipments", href: "/shipments", icon: "Truck" },
    { title: "Search", href: "/search", icon: "Search" },
    { title: "Logs", href: "/event-logs", icon: "ScrollText" },
  ] as const,
  retail: [
    { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { title: "Stock", href: "/inventory", icon: "Package" },
    { title: "Search", href: "/search", icon: "Search" },
    { title: "Logs", href: "/event-logs", icon: "ScrollText" },
  ] as const,
} as const;
