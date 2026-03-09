const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================================================
// Types
// ============================================================================

export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";

export type ShipmentStatus = "PENDING" | "CONFIRMED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED" | "CANCELLED";

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
  tags?: string[];
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
    api.get<Shipment[]>("/shipments", { params }),

  getById: (id: string) =>
    api.get<Shipment>(`/shipments/${id}`),

  create: (data: {
    trackingId: string;
    fromLocationId: string;
    toLocationId: string;
    status?: ShipmentStatus;
    userId?: string;
    notes?: string;
  }) =>
    api.post<Shipment>("/shipments", data),

  update: (id: string, data: Partial<Omit<Shipment, "id" | "createdAt" | "updatedAt">>) =>
    api.patch<Shipment>(`/shipments/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/shipments/${id}`),
};

// ============================================================================
// Default Export
// ============================================================================

export default api;
