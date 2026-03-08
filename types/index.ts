export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum AdjustmentType {
  INCREASE = "increase",
  DECREASE = "decrease",
  DAMAGE = "damage",
  LOSS = "loss",
}


export enum EventType {
  CREATED = "created",
  CONFIRMED = "confirmed",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  FAILED = "failed",
  CANCELLED = "cancelled",
  STOCK_ADJUSTED = "stock_adjusted",
  STOCK_TRANSFERRED = "stock_transferred",
  PRODUCT_CREATED = "product_created",
  PRODUCT_UPDATED = "product_updated",
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
}

/**
 * User Interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationId?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Location Interface
 */
export interface Location {
  id: string;
  name: string;
  code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isWarehouse: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product Interface
 */
export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  category?: string;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  batchTracking: boolean;
  expiryTracking: boolean;
  tags?: string[];
  description?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory Item Interface
 */
export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  batchNumber?: string;
  quantity: number;
  availableQuantity: number;
  expiryDate?: string;
  costPrice?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shipment Item Interface
 */
export interface ShipmentItem {
  id: string;
  shipmentId: string;
  productId: string;
  product?: Product;
  quantity: number;
  batchNumber?: string;
}

/**
 * Shipment Interface
 */
export interface Shipment {
  id: string;
  trackingNumber: string;
  referenceNumber?: string;
  fromLocationId: string;
  fromLocation?: Location;
  toLocationId: string;
  toLocation?: Location;
  status: ShipmentStatus;
  scheduledDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  items: ShipmentItem[];
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Shipment Event Interface
 */
export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  eventType: EventType;
  location?: string;
  latitude?: number;
  longitude?: number;
  temperature?: number;
  notes?: string;
  createdBy?: string;
  createdAt: string;
}

/**
 * Stock Adjustment Interface
 */
export interface StockAdjustment {
  id: string;
  productId: string;
  product?: Product;
  locationId: string;
  location?: Location;
  type: AdjustmentType;
  quantity: number;
  batchNumber?: string;
  reason: string;
  costPrice?: number;
  createdBy?: string;
  createdAt: string;
}

/**
 * Analytics Data Interface
 */
export interface AnalyticsData {
  totalProducts: number;
  totalLocations: number;
  totalShipments: number;
  lowStockCount: number;
  expiringItemsCount: number;
  inTransitCount: number;
  inventoryTrend: {
    date: string;
    quantity: number;
  }[];
  shipmentStatusDistribution: {
    status: string;
    count: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
    value: number;
  }[];
}

/**
 * Pagination Params
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * Create/Update User Request
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  locationId?: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  locationId?: string;
  status?: UserStatus;
}

/**
 * Create/Update Product Request
 */
export interface CreateProductRequest {
  sku?: string;
  barcode?: string;
  name: string;
  category?: string;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  batchTracking: boolean;
  expiryTracking: boolean;
  tags?: string[];
  description?: string;
}

export interface UpdateProductRequest {
  sku?: string;
  barcode?: string;
  name?: string;
  category?: string;
  unit?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  batchTracking?: boolean;
  expiryTracking?: boolean;
  tags?: string[];
  description?: string;
  status?: ProductStatus;
}

/**
 * Create/Update Location Request
 */
export interface CreateLocationRequest {
  name: string;
  code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isWarehouse: boolean;
}

export interface UpdateLocationRequest {
  name?: string;
  code?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isWarehouse?: boolean;
  isActive?: boolean;
}

/**
 * Create Shipment Request
 */
export interface CreateShipmentRequest {
  fromLocationId: string;
  toLocationId: string;
  referenceNumber?: string;
  scheduledDate?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    batchNumber?: string;
  }[];
}

/**
 * Stock Adjustment Request
 */
export interface StockAdjustmentRequest {
  productId: string;
  locationId: string;
  type: AdjustmentType;
  quantity: number;
  batchNumber?: string;
  reason: string;
  costPrice?: number;
}

/**
 * Stock Transfer Request
 */
export interface StockTransferRequest {
  productId: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  batchNumber?: string;
  scheduledDate?: string;
  reason?: string;
}
