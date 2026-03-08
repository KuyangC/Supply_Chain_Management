const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Base API client with authentication handling
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  //query string
  const queryString = params 
  ? "?" + new URLSearchParams(
    Object.entries(params)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => [k, String(v)])
  ).toString()
  :"";

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
  const response = await fetch(url, {...fetchOptions, headers});

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Handle error
  if (!response.ok){
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "Request failed",
      response.status,
      errorData
    );
  }

  return response.json();
}

/**
 * API Client Object
 */
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

/**
 * Auth API
 */

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),

  register: (data: { email: string; name: string; password: string; role?: string}) =>
    api.post<User>("/auth/register", data),
};

/**
 * User API
 */

export const usersAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<User[]>("/users", { params }),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: { email: string; name: string; password: string; role?: string }) =>
    api.post<User>("/users", data),

  delete: (id: string) =>
    api.delete<void>(`/users/${id}`),
};

/**
 * Shipment API
 */

export interface Shipment {
  id: string;
  trackingId: string;
  fromLocationId: string;
  status: "PENDING" | "CONFIRMED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED" | "CANCELLED";
  userId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  fromLocation?: { id: string; name: string };
  toLocation?: { id: string; name: string };
  user?: { id: string; name: string };
  items?: ShipmentItem[];
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  productId: string;
  qty: number;
  createdAt: string;
  product?: { id: string; name: string; sku: string };
}

export const shipmentApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
      api.get<Shipment[]>("/shipments", { params }),

  getById: (id: string) =>
    api.get<Shipment>(`/shipments/${id}`),

  create: (data: {
    trackingId: string;
    fromLocationId: string;
    toLocationId: string;
    status?: string;
    userId?: string;
    notes?: string;
  }) =>
    api.post<Shipment>("/shipments", data),

  update: (id: string, data: Partial<Shipment>) =>
    api.patch<Shipment>(`/shipments/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/shipments/${id}`),
}

export default api;
