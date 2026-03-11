const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================================================
// Types
// ============================================================================

export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";

export type ShipmentStatus = "PENDING" | "CONFIRMED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED" | "CANCELLED";

export type SupplierStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED";

export type TransferStatus = "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED" | "FAILED";

export type ReturnStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "REFUNDED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  tags?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: string;
  createdAt: string;
}

export interface Inventory {
  id: string;
  productId: string;
  locationId: string;
  batch?: string;
  qty: number;
  reserved: number;
  available: number;
  expiry?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
  location?: {
    id: string;
    name: string;
  };
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  productId: string;
  qty: number;
  createdAt: string;
  product?: { id: string; name: string; sku: string };
}

export interface Shipment {
  id: string;
  trackingId: string;
  fromLocationId: string;
  toLocationId: string;
  status: ShipmentStatus;
  userId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  fromLocation?: { id: string; name: string };
  toLocation?: { id: string; name: string };
  user?: { id: string; name: string };
  items?: ShipmentItem[];
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: SupplierStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransfer {
  id: string;
  productId: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  status: TransferStatus;
  notes?: string;
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  product?: { id: string; name: string; sku: string };
  fromLocation?: { id: string; name: string };
  toLocation?: { id: string; name: string };
}

export interface ProductReturn {
  id: string;
  productId: string;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  supplierId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product?: { id: string; name: string; sku: string };
  supplier?: { id: string; name: string };
}

// ============================================================================
// API Error
// ============================================================================

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================================================
// Request Options
// ============================================================================

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

// ============================================================================
// Base Request Function
// ============================================================================

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  // query string
  const queryString = params
    ? "?" + new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()
    : "";

  const url = `${API_URL}${endpoint}${queryString}`;

  // prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  // Add auth token client side only
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Fetch
  const response = await fetch(url, { ...fetchOptions, headers });

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Handle error
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "Request failed",
      response.status,
      errorData
    );
  }

  return response.json();
}

// ============================================================================
// Base API Client
// ============================================================================

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),

  register: (data: { email: string; name: string; password: string; role?: string }) =>
    api.post<User>("/auth/register", data),
};

// ============================================================================
// Users API
// ============================================================================

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<User[]>("/users", { params }),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: { email: string; name: string; password: string; role?: string }) =>
    api.post<User>("/users", data),

  update: (id: string, data: Partial<Pick<User, "name" | "email" | "role">>) =>
    api.patch<User>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/users/${id}`),
};

// ============================================================================
// Products API
// ============================================================================

export const productsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<Product[]>("/products", { params }),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`),

  create: (data: {
    sku: string;
    name: string;
    category: string;
    unit: string;
    stock: number;
    minStock: number;
    tags?: string;
    status?: string;
  }) =>
    api.post<Product>("/products", data),

  update: (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) =>
    api.patch<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/products/${id}`),
};

// ============================================================================
// Locations API
// ============================================================================

export const locationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<Location[]>("/locations", { params }),

  getById: (id: string) =>
    api.get<Location>(`/locations/${id}`),

  create: (data: {
    name: string;
    address?: string;
    type: string;
  }) =>
    api.post<Location>("/locations", data),

  update: (id: string, data: Partial<Omit<Location, "id" | "createdAt">>) =>
    api.patch<Location>(`/locations/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/locations/${id}`),
};

// ============================================================================
// Inventory API
// ============================================================================

export const inventoryApi = {
  getAll: (params?: { page?: number; limit?: number; productId?: string; locationId?: string }) =>
    api.get<Inventory[]>("/inventory", { params }),

  getById: (id: string) =>
    api.get<Inventory>(`/inventory/${id}`),

  create: (data: {
    productId: string;
    locationId: string;
    batch?: string;
    qty: number;
    reserved?: number;
    available?: number;
    expiry?: string;
  }) =>
    api.post<Inventory>("/inventory", data),

  update: (id: string, data: Partial<Omit<Inventory, "id" | "createdAt" | "updatedAt">>) =>
    api.patch<Inventory>(`/inventory/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/inventory/${id}`),
};

// ============================================================================
// Shipments API
// ============================================================================

export const shipmentsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<Shipment[]>("/shipment", { params }),

  getById: (id: string) =>
    api.get<Shipment>(`/shipment/${id}`),

  create: (data: {
    trackingId: string;
    fromLocationId: string;
    toLocationId: string;
    status?: ShipmentStatus;
    userId?: string;
    notes?: string;
  }) =>
    api.post<Shipment>("/shipment", data),

  update: (id: string, data: Partial<Omit<Shipment, "id" | "createdAt" | "updatedAt">>) =>
    api.patch<Shipment>(`/shipment/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/shipment/${id}`),
};

// ============================================================================
// Mock Data (for frontend development before backend is ready)
// ============================================================================

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0101",
    address: "123 Industrial Ave, Suite 100, San Francisco, CA 94102",
    contactPerson: "John Smith",
    status: "ACTIVE",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-01T14:30:00Z",
  },
  {
    id: "sup-2",
    name: "Global Parts Distributors",
    email: "orders@globalparts.com",
    phone: "+1-555-0102",
    address: "456 Commerce Blvd, Dallas, TX 75201",
    contactPerson: "Sarah Johnson",
    status: "ACTIVE",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-05T11:20:00Z",
  },
  {
    id: "sup-3",
    name: "TechSupply Co.",
    email: "info@techsupply.io",
    phone: "+1-555-0103",
    address: "789 Innovation Way, Austin, TX 78701",
    contactPerson: "Mike Chen",
    status: "ACTIVE",
    createdAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-03-08T16:45:00Z",
  },
  {
    id: "sup-4",
    name: "Pacific Logistics",
    email: "sales@pacificlogistics.net",
    phone: "+1-555-0104",
    address: "321 Harbor St, Seattle, WA 98101",
    contactPerson: "Lisa Wang",
    status: "INACTIVE",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-02-28T09:15:00Z",
  },
  {
    id: "sup-5",
    name: "Midwest Materials Inc",
    email: "orders@midwestmaterials.com",
    phone: "+1-555-0105",
    address: "555 Factory Rd, Chicago, IL 60601",
    contactPerson: "Robert Davis",
    status: "PENDING",
    createdAt: "2024-03-01T10:30:00Z",
    updatedAt: "2024-03-01T10:30:00Z",
  },
];

export const MOCK_TRANSFERS: StockTransfer[] = [
  {
    id: "trf-1",
    productId: "prod-1",
    fromLocationId: "loc-1",
    toLocationId: "loc-2",
    quantity: 50,
    status: "PENDING",
    notes: "Urgent restocking needed",
    requestedBy: "user-1",
    createdAt: "2024-03-08T08:00:00Z",
    updatedAt: "2024-03-08T08:00:00Z",
    product: { id: "prod-1", name: "Wireless Mouse", sku: "WM-001" },
    fromLocation: { id: "loc-1", name: "Warehouse 1" },
    toLocation: { id: "loc-2", name: "Store A" },
  },
  {
    id: "trf-2",
    productId: "prod-2",
    fromLocationId: "loc-1",
    toLocationId: "loc-3",
    quantity: 100,
    status: "IN_TRANSIT",
    notes: "Weekly inventory transfer",
    requestedBy: "user-2",
    approvedBy: "user-3",
    createdAt: "2024-03-07T14:30:00Z",
    updatedAt: "2024-03-08T10:15:00Z",
    product: { id: "prod-2", name: "USB-C Cable", sku: "USB-002" },
    fromLocation: { id: "loc-1", name: "Warehouse 1" },
    toLocation: { id: "loc-3", name: "Store B" },
  },
  {
    id: "trf-3",
    productId: "prod-3",
    fromLocationId: "loc-2",
    toLocationId: "loc-3",
    quantity: 25,
    status: "COMPLETED",
    notes: "Special customer order",
    requestedBy: "user-1",
    approvedBy: "user-3",
    createdAt: "2024-03-05T09:00:00Z",
    updatedAt: "2024-03-06T16:00:00Z",
    product: { id: "prod-3", name: "Keyboard", sku: "KB-003" },
    fromLocation: { id: "loc-2", name: "Store A" },
    toLocation: { id: "loc-3", name: "Store B" },
  },
  {
    id: "trf-4",
    productId: "prod-4",
    fromLocationId: "loc-1",
    toLocationId: "loc-2",
    quantity: 75,
    status: "CANCELLED",
    notes: "Cancelled due to insufficient stock",
    requestedBy: "user-2",
    createdAt: "2024-03-04T11:00:00Z",
    updatedAt: "2024-03-04T13:30:00Z",
    product: { id: "prod-4", name: "Monitor Stand", sku: "MS-004" },
    fromLocation: { id: "loc-1", name: "Warehouse 1" },
    toLocation: { id: "loc-2", name: "Store A" },
  },
  {
    id: "trf-5",
    productId: "prod-5",
    fromLocationId: "loc-3",
    toLocationId: "loc-1",
    quantity: 30,
    status: "FAILED",
    notes: "Transportation issue",
    requestedBy: "user-1",
    createdAt: "2024-03-03T15:00:00Z",
    updatedAt: "2024-03-04T09:00:00Z",
    product: { id: "prod-5", name: "Laptop Sleeve", sku: "LS-005" },
    fromLocation: { id: "loc-3", name: "Store B" },
    toLocation: { id: "loc-1", name: "Warehouse 1" },
  },
];

export const MOCK_RETURNS: ProductReturn[] = [
  {
    id: "ret-1",
    productId: "prod-1",
    quantity: 5,
    reason: "Damaged packaging",
    status: "PENDING",
    supplierId: "sup-1",
    notes: "Customer return - boxes crushed during shipping",
    createdAt: "2024-03-08T10:00:00Z",
    updatedAt: "2024-03-08T10:00:00Z",
    product: { id: "prod-1", name: "Wireless Mouse", sku: "WM-001" },
    supplier: { id: "sup-1", name: "Acme Corporation" },
  },
  {
    id: "ret-2",
    productId: "prod-2",
    quantity: 10,
    reason: "Defective product",
    status: "APPROVED",
    supplierId: "sup-2",
    notes: "Quality control failure - batch #2024-03-A",
    createdAt: "2024-03-07T14:00:00Z",
    updatedAt: "2024-03-08T09:30:00Z",
    product: { id: "prod-2", name: "USB-C Cable", sku: "USB-002" },
    supplier: { id: "sup-2", name: "Global Parts Distributors" },
  },
  {
    id: "ret-3",
    productId: "prod-3",
    quantity: 3,
    reason: "Wrong item shipped",
    status: "COMPLETED",
    supplierId: "sup-3",
    notes: "Customer ordered different model - return processed",
    createdAt: "2024-03-05T11:00:00Z",
    updatedAt: "2024-03-06T15:00:00Z",
    product: { id: "prod-3", name: "Keyboard", sku: "KB-003" },
    supplier: { id: "sup-3", name: "TechSupply Co." },
  },
  {
    id: "ret-4",
    productId: "prod-4",
    quantity: 8,
    reason: "Customer dissatisfaction",
    status: "REJECTED",
    supplierId: "sup-1",
    notes: "Return period expired - denied by supplier",
    createdAt: "2024-03-04T09:00:00Z",
    updatedAt: "2024-03-05T10:00:00Z",
    product: { id: "prod-4", name: "Monitor Stand", sku: "MS-004" },
    supplier: { id: "sup-1", name: "Acme Corporation" },
  },
  {
    id: "ret-5",
    productId: "prod-5",
    quantity: 12,
    reason: "Bulk order cancellation",
    status: "REFUNDED",
    supplierId: "sup-2",
    notes: "Customer cancelled before shipping - full refund issued",
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-03-02T14:00:00Z",
    product: { id: "prod-5", name: "Laptop Sleeve", sku: "LS-005" },
    supplier: { id: "sup-2", name: "Global Parts Distributors" },
  },
];

// ============================================================================
// Default Export
// ============================================================================

export default api;
