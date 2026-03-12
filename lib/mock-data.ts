/**
 * Mock Data for Supply Chain Tracking System
 * For development before backend is ready
 */

// ============================================================================
// Types
// ============================================================================

export type LocationType = "supplier" | "manufacturer" | "warehouse" | "distributor" | "retail";
export type ProductType = "raw" | "finished";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "operator" | "viewer";
  locationId: string;
  locationName: string;
  locationType: LocationType;
}

export interface ProductionBatch {
  id: string;
  locationId: string;
  locationName: string;
  productId: string;
  productName: string;
  targetQuantity: number;
  status: "raw_material" | "in_production" | "finished" | "packed" | "shipped";
  rawMaterials: {
    productId: string;
    productName: string;
    quantity: number;
    serialFrom: string;
    serialTo: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockItem {
  uuid: string;
  productId: string;
  productName: string;
  type: ProductType;
  currentLocationId: string;
  currentLocationName: string;
  status: string;
  batchId?: string;
  manufacturingDate?: string;
  journey: {
    date: string;
    event: string;
    location: string;
  }[];
}

// ============================================================================
// Mock Users (for testing location-based dashboards)
// ============================================================================

export const MOCK_USERS: Record<LocationType, MockUser> = {
  supplier: {
    id: "user-supplier-001",
    name: "Budi Supplier",
    email: "budi@supplier.com",
    role: "manager",
    locationId: "loc-supplier-001",
    locationName: "Supplier ABC",
    locationType: "supplier",
  },
  manufacturer: {
    id: "user-mfr-001",
    name: "Andi Manufaktur",
    email: "andi@manufaktur.com",
    role: "manager",
    locationId: "loc-mfr-001",
    locationName: "Manufaktur MotorProd",
    locationType: "manufacturer",
  },
  warehouse: {
    id: "user-whl-001",
    name: "Citra Warehouse",
    email: "citra@warehouse.com",
    role: "manager",
    locationId: "loc-whl-001",
    locationName: "Warehouse Jakarta",
    locationType: "warehouse",
  },
  distributor: {
    id: "user-dist-001",
    name: "Dedi Distributor",
    email: "dedi@distributor.com",
    role: "manager",
    locationId: "loc-dist-001",
    locationName: "Distributor Jawa",
    locationType: "distributor",
  },
  retail: {
    id: "user-retail-001",
    name: "Rina Retail",
    email: "rina@retail.com",
    role: "manager",
    locationId: "loc-retail-001",
    locationName: "Retail Jakarta Pusat",
    locationType: "retail",
  },
};

// ============================================================================
// Mock Production Batches
// ============================================================================

export const MOCK_PRODUCTION_BATCHES: ProductionBatch[] = [
  {
    id: "PB-2025-001",
    locationId: "loc-mfr-001",
    locationName: "Manufaktur MotorProd",
    productId: "prod-ecu-001",
    productName: "ECU Motor",
    targetQuantity: 1000,
    status: "in_production",
    rawMaterials: [
      {
        productId: "raw-semikonduktor",
        productName: "Semikonduktor",
        quantity: 1000,
        serialFrom: "550e8400-0001",
        serialTo: "550e8400-1000",
      },
    ],
    createdBy: "user-mfr-001",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-12T14:30:00Z",
  },
  {
    id: "PB-2025-002",
    locationId: "loc-mfr-001",
    locationName: "Manufaktur MotorProd",
    productId: "prod-sensor-001",
    productName: "Sensor",
    targetQuantity: 500,
    status: "finished",
    rawMaterials: [
      {
        productId: "raw-chip",
        productName: "Chip Sensor",
        quantity: 500,
        serialFrom: "550e8500-0001",
        serialTo: "550e8500-0500",
      },
    ],
    createdBy: "user-mfr-001",
    createdAt: "2025-01-08T09:00:00Z",
    updatedAt: "2025-01-10T16:00:00Z",
  },
  {
    id: "PB-2025-003",
    locationId: "loc-mfr-001",
    locationName: "Manufaktur MotorProd",
    productId: "prod-ecu-001",
    productName: "ECU Motor",
    targetQuantity: 500,
    status: "raw_material",
    rawMaterials: [
      {
        productId: "raw-semikonduktor",
        productName: "Semikonduktor",
        quantity: 500,
        serialFrom: "550e8600-0001",
        serialTo: "550e8600-0500",
      },
    ],
    createdBy: "user-mfr-001",
    createdAt: "2025-01-12T08:00:00Z",
    updatedAt: "2025-01-12T08:00:00Z",
  },
];

// ============================================================================
// Mock Items (for search/tracking)
// ============================================================================

export const MOCK_ITEMS: MockItem[] = [
  {
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    productId: "prod-ecu-001",
    productName: "ECU Motor",
    type: "finished",
    currentLocationId: "loc-retail-001",
    currentLocationName: "Retail Jakarta Pusat",
    status: "available",
    batchId: "PB-2025-002",
    manufacturingDate: "2025-01-10",
    journey: [
      { date: "2025-01-05", event: "Created", location: "Supplier ABC" },
      { date: "2025-01-06", event: "Received Raw Material", location: "Manufaktur MotorProd" },
      { date: "2025-01-08", event: "In Production", location: "Manufaktur MotorProd" },
      { date: "2025-01-10", event: "Finished Good", location: "Manufaktur MotorProd" },
      { date: "2025-01-11", event: "Shipped", location: "Warehouse Jakarta" },
      { date: "2025-01-12", event: "Received", location: "Warehouse Jakarta" },
      { date: "2025-01-18", event: "Shipped", location: "Distributor Jawa" },
      { date: "2025-01-19", event: "Received", location: "Distributor Jawa" },
      { date: "2025-01-20", event: "Shipped", location: "Retail Jakarta Pusat" },
      { date: "2025-01-21", event: "Received", location: "Retail Jakarta Pusat" },
    ],
  },
  {
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    productId: "prod-sensor-001",
    productName: "Sensor",
    type: "finished",
    currentLocationId: "loc-whl-001",
    currentLocationName: "Warehouse Jakarta",
    status: "in_stock",
    batchId: "PB-2025-002",
    manufacturingDate: "2025-01-10",
    journey: [
      { date: "2025-01-05", event: "Created", location: "Supplier ABC" },
      { date: "2025-01-06", event: "Received Raw Material", location: "Manufaktur MotorProd" },
      { date: "2025-01-08", event: "Finished Good", location: "Manufaktur MotorProd" },
      { date: "2025-01-11", event: "Shipped", location: "Warehouse Jakarta" },
      { date: "2025-01-12", event: "Received", location: "Warehouse Jakarta" },
    ],
  },
];

// ============================================================================
// Dashboard Data by Location Type
// ============================================================================

export interface DashboardData {
  summaryCards: {
    title: string;
    value: number;
    icon: string;
    trend?: { value: string; direction: "up" | "down" };
    variant?: "info" | "warning" | "danger";
  }[];
  recentShipments: {
    id: string;
    from: string;
    to: string;
    product: string;
    status: string;
    date: string;
  }[];
  alerts: {
    id: number;
    type: "warning" | "danger" | "success" | "info";
    title: string;
    message: string;
    time: string;
  }[];
  // Manufacturer-specific data
  productionBatches?: {
    id: string;
    product: string;
    target: number;
    status: "raw_material" | "in_production" | "finished" | "packed" | "shipped";
    startedDate: string;
  }[];
  incomingShipmentsToConfirm?: {
    id: string;
    from: string;
    product: string;
    quantity: number;
    date: string;
  }[];
  // Warehouse-specific data
  stockSummary?: {
    product: string;
    rawQty: number;
    finishedQty: number;
    total: number;
  }[];
  // Distributor-specific data
  pendingRetailOrders?: {
    id: string;
    retailStore: string;
    product: string;
    quantity: number;
    status: string;
    orderDate: string;
  }[];
  // Retail-specific data
  lowStockProducts?: {
    id: string;
    product: string;
    currentStock: number;
    minStock: number;
  }[];
}

export const DASHBOARD_DATA_BY_LOCATION: Record<LocationType, DashboardData> = {
  supplier: {
    summaryCards: [
      { title: "Total Sent", value: 12450, icon: "Package", trend: { value: "+5%", direction: "up" } },
      { title: "In Transit", value: 2300, icon: "Truck", trend: { value: "+200", direction: "up" }, variant: "info" },
      { title: "Pending Confirm", value: 150, icon: "Clock", trend: { value: "-50", direction: "down" }, variant: "warning" },
      { title: "This Month", value: 3200, icon: "Calendar", trend: { value: "+12%", direction: "up" } },
    ],
    recentShipments: [
      { id: "SHP-001", from: "Supplier ABC", to: "Manufaktur A", product: "Semikonduktor", status: "in_transit", date: "Jan 10, 2025" },
      { id: "SHP-002", from: "Supplier ABC", to: "Warehouse B", product: "PCB", status: "confirmed", date: "Jan 09, 2025" },
      { id: "SHP-003", from: "Supplier ABC", to: "Manufaktur A", product: "Kapasitor", status: "delivered", date: "Jan 08, 2025" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Pending Confirmation", message: "150 shipments awaiting receiver confirmation", time: "Just now" },
      { id: 2, type: "success", title: "Shipments Delivered", message: "25 shipments delivered this week", time: "2 hours ago" },
    ],
  },
  manufacturer: {
    summaryCards: [
      { title: "Raw Material", value: 8500, icon: "Package", trend: { value: "+500", direction: "up" } },
      { title: "In Production", value: 2300, icon: "Factory", trend: { value: "+300", direction: "up" }, variant: "info" },
      { title: "Finished Goods", value: 5200, icon: "CheckCircle", trend: { value: "+800", direction: "up" } },
      { title: "Ready to Ship", value: 4800, icon: "Truck", trend: { value: "+400", direction: "up" } },
    ],
    recentShipments: [
      { id: "SHP-010", from: "Manufaktur A", to: "Warehouse B", product: "ECU Motor", status: "delivered", date: "Jan 10, 2025" },
      { id: "SHP-009", from: "Supplier ABC", to: "Manufaktur A", product: "Semikonduktor", status: "delivered", date: "Jan 09, 2025" },
      { id: "SHP-008", from: "Manufaktur A", to: "Retail X", product: "ECU Motor", status: "in_transit", date: "Jan 08, 2025" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Incoming Raw Material", message: "1000 pcs Semikonduktor from Supplier ABC", time: "Just now" },
      { id: 2, type: "success", title: "Production Complete", message: "Batch PB-2025-002: 500 Sensor finished", time: "1 hour ago" },
      { id: 3, type: "info", title: "Low Raw Material", message: "PCB stock running low (200 pcs left)", time: "3 hours ago" },
    ],
    productionBatches: [
      { id: "PB-2025-001", product: "ECU Motor", target: 1000, status: "in_production", startedDate: "Jan 10, 2025" },
      { id: "PB-2025-002", product: "Sensor", target: 500, status: "finished", startedDate: "Jan 08, 2025" },
      { id: "PB-2025-003", product: "ECU Motor", target: 500, status: "raw_material", startedDate: "Jan 12, 2025" },
      { id: "PB-2025-004", product: "Brake Assembly", target: 200, status: "in_production", startedDate: "Jan 11, 2025" },
      { id: "PB-2025-005", product: "Headlight Module", target: 300, status: "packed", startedDate: "Jan 09, 2025" },
    ],
    incomingShipmentsToConfirm: [
      { id: "SHP-011", from: "Supplier ABC", product: "Semikonduktor", quantity: 1000, date: "Jan 12, 2025" },
      { id: "SHP-012", from: "Supplier XYZ", product: "PCB Board", quantity: 500, date: "Jan 12, 2025" },
      { id: "SHP-013", from: "Supplier ABC", product: "Kapasitor", quantity: 200, date: "Jan 11, 2025" },
    ],
  },
  warehouse: {
    summaryCards: [
      { title: "Raw Material", value: 3200, icon: "Package", trend: { value: "+200", direction: "up" } },
      { title: "Finished Goods", value: 15800, icon: "Box", trend: { value: "+1000", direction: "up" } },
      { title: "In Transit", value: 1500, icon: "Truck", trend: { value: "-300", direction: "down" }, variant: "info" },
      { title: "Ready to Ship", value: 14300, icon: "Ship", trend: { value: "+500", direction: "up" } },
    ],
    recentShipments: [
      { id: "SHP-020", from: "Manufaktur A", to: "Warehouse B", product: "ECU Motor", status: "in_transit", date: "Jan 10, 2025" },
      { id: "SHP-019", from: "Supplier ABC", to: "Warehouse B", product: "Semikonduktor", status: "delivered", date: "Jan 09, 2025" },
      { id: "SHP-018", from: "Warehouse B", to: "Distributor Jawa", product: "ECU Motor", status: "delivered", date: "Jan 08, 2025" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Incoming Shipments", message: "2 shipments arriving today", time: "Just now" },
      { id: 2, type: "success", title: "Stock Updated", message: "1000 ECU Motor added to stock", time: "2 hours ago" },
    ],
    incomingShipmentsToConfirm: [
      { id: "SHP-021", from: "Manufaktur A", product: "ECU Motor", quantity: 500, date: "Jan 12, 2025" },
      { id: "SHP-022", from: "Supplier ABC", product: "Semikonduktor", quantity: 1000, date: "Jan 12, 2025" },
      { id: "SHP-023", from: "Manufaktur A", product: "Sensor", quantity: 300, date: "Jan 11, 2025" },
    ],
    stockSummary: [
      { product: "ECU Motor", rawQty: 500, finishedQty: 3500, total: 4000 },
      { product: "Sensor", rawQty: 300, finishedQty: 2200, total: 2500 },
      { product: "Brake Assembly", rawQty: 200, finishedQty: 1800, total: 2000 },
      { product: "Headlight Module", rawQty: 150, finishedQty: 1350, total: 1500 },
      { product: "Battery Pack", rawQty: 400, finishedQty: 2600, total: 3000 },
      { product: "Transmission", rawQty: 100, finishedQty: 900, total: 1000 },
    ],
  },
  distributor: {
    summaryCards: [
      { title: "Total Stock", value: 8500, icon: "Package", trend: { value: "+500", direction: "up" } },
      { title: "In Transit", value: 1200, icon: "Truck", trend: { value: "+200", direction: "up" }, variant: "info" },
      { title: "This Week", value: 2300, icon: "Calendar", trend: { value: "+15%", direction: "up" } },
      { title: "Pending Retail", value: 8, icon: "Store", trend: { value: "+3", direction: "up" }, variant: "warning" },
    ],
    recentShipments: [
      { id: "SHP-030", from: "Warehouse B", to: "Distributor Jawa", product: "ECU Motor", status: "delivered", date: "Jan 10, 2025" },
      { id: "SHP-029", from: "Warehouse B", to: "Distributor Jawa", product: "Sensor", status: "delivered", date: "Jan 09, 2025" },
      { id: "SHP-028", from: "Distributor Jawa", to: "Retail X", product: "ECU Motor", status: "in_transit", date: "Jan 08, 2025" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Pending Orders", message: "8 retail stores awaiting shipment", time: "Just now" },
      { id: 2, type: "success", title: "Stock Received", message: "500 ECU Motor from Warehouse", time: "1 hour ago" },
    ],
    pendingRetailOrders: [
      { id: "ORD-001", retailStore: "Retail Jakarta Pusat", product: "ECU Motor", quantity: 100, status: "pending", orderDate: "Jan 12, 2025" },
      { id: "ORD-002", retailStore: "Retail Jakarta Selatan", product: "Sensor", quantity: 50, status: "pending", orderDate: "Jan 12, 2025" },
      { id: "ORD-003", retailStore: "Retail Bandung", product: "Brake Assembly", quantity: 75, status: "processing", orderDate: "Jan 11, 2025" },
      { id: "ORD-004", retailStore: "Retail Surabaya", product: "ECU Motor", quantity: 120, status: "pending", orderDate: "Jan 11, 2025" },
      { id: "ORD-005", retailStore: "Retail Medan", product: "Headlight Module", quantity: 80, status: "processing", orderDate: "Jan 10, 2025" },
    ],
  },
  retail: {
    summaryCards: [
      { title: "Total Stock", value: 1200, icon: "Package", trend: { value: "+100", direction: "up" } },
      { title: "Available", value: 950, icon: "CheckCircle", trend: { value: "+50", direction: "up" } },
      { title: "Low Stock", value: 15, icon: "AlertTriangle", trend: { value: "-5", direction: "down" }, variant: "warning" },
      { title: "This Week Sales", value: 250, icon: "TrendingUp", trend: { value: "+12%", direction: "up" } },
    ],
    recentShipments: [
      { id: "SHP-040", from: "Distributor Jawa", to: "Retail Jakarta", product: "ECU Motor", status: "delivered", date: "Jan 10, 2025" },
      { id: "SHP-039", from: "Warehouse B", to: "Retail Jakarta", product: "Sensor", status: "delivered", date: "Jan 08, 2025" },
      { id: "SHP-038", from: "Distributor Jawa", to: "Retail Jakarta", product: "ECU Motor", status: "in_transit", date: "Jan 07, 2025" },
    ],
    alerts: [
      { id: 1, type: "warning", title: "Low Stock Alert", message: "15 products running low on stock", time: "Just now" },
      { id: 2, type: "success", title: "Shipment Received", message: "100 ECU Motor from Distributor", time: "3 hours ago" },
    ],
    lowStockProducts: [
      { id: "PROD-001", product: "ECU Motor", currentStock: 8, minStock: 20 },
      { id: "PROD-002", product: "Brake Pad", currentStock: 12, minStock: 30 },
      { id: "PROD-003", product: "Oil Filter", currentStock: 5, minStock: 25 },
      { id: "PROD-004", product: "Spark Plug", currentStock: 15, minStock: 40 },
      { id: "PROD-005", product: "Air Filter", currentStock: 10, minStock: 20 },
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get current user (mock)
 * In real app, this would come from auth context
 */
export function getCurrentUser(locationType?: LocationType): MockUser {
  // For development, return user based on locationType param
  // or default to manufacturer
  return MOCK_USERS[locationType || "manufacturer"];
}

/**
 * Get dashboard data for specific location type
 */
export function getDashboardData(locationType: LocationType): DashboardData {
  return DASHBOARD_DATA_BY_LOCATION[locationType];
}
