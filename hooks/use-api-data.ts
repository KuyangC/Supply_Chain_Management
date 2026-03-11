/**
 * Custom hooks for API data fetching with TanStack Query
 * Provides consistent error handling, loading states, and caching
 */

"use client";

import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { productsApi, inventoryApi, shipmentsApi, usersApi, authApi, locationsApi, ApiError } from "@/lib/api";
import type { Product, Inventory, Shipment, User, Location } from "@/lib/api";

/**
 * Hook to fetch all products with optional pagination
 */
export function useProducts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getAll(params),
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a product mutation
 */
export function useCreateProduct(options?: Omit<UseMutationOptions<Product, ApiError, Parameters<typeof productsApi.create>[0]>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    ...options,
  });
}

/**
 * Hook to update a product mutation
 */
export function useUpdateProduct(options?: Omit<UseMutationOptions<Product, ApiError, { id: string; data: Parameters<typeof productsApi.update>[1] }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
    ...options,
  });
}

/**
 * Hook to delete a product mutation
 */
export function useDeleteProduct(options?: Omit<UseMutationOptions<void, ApiError, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    ...options,
  });
}

/**
 * Hook to fetch all inventory items with optional filters
 */
export function useInventory(params?: { page?: number; limit?: number; productId?: string; locationId?: string }) {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => inventoryApi.getAll(params),
  });
}

/**
 * Hook to fetch a single inventory item by ID
 */
export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create an inventory item mutation
 */
export function useCreateInventory(options?: Omit<UseMutationOptions<Inventory, ApiError, Parameters<typeof inventoryApi.create>[0]>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    ...options,
  });
}

/**
 * Hook to update an inventory item mutation
 */
export function useUpdateInventory(options?: Omit<UseMutationOptions<Inventory, ApiError, { id: string; data: Parameters<typeof inventoryApi.update>[1] }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => inventoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.id] });
    },
    ...options,
  });
}

/**
 * Hook to fetch all shipments with optional pagination
 */
export function useShipments(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["shipments", params],
    queryFn: () => shipmentsApi.getAll(params),
  });
}

/**
 * Hook to fetch a single shipment by ID
 */
export function useShipment(id: string) {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: () => shipmentsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a shipment mutation
 */
export function useCreateShipment(options?: Omit<UseMutationOptions<Shipment, ApiError, Parameters<typeof shipmentsApi.create>[0]>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shipmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    ...options,
  });
}

/**
 * Hook to update a shipment mutation
 */
export function useUpdateShipment(options?: Omit<UseMutationOptions<Shipment, ApiError, { id: string; data: Parameters<typeof shipmentsApi.update>[1] }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => shipmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment", variables.id] });
    },
    ...options,
  });
}

/**
 * Hook to delete a shipment mutation
 */
export function useDeleteShipment(options?: Omit<UseMutationOptions<void, ApiError, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shipmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    ...options,
  });
}

/**
 * Hook to fetch all users with optional pagination
 */
export function useUsers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.getAll(params),
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a user mutation
 */
export function useCreateUser(options?: Omit<UseMutationOptions<User, ApiError, Parameters<typeof usersApi.create>[0]>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    ...options,
  });
}

/**
 * Hook to update a user mutation
 */
export function useUpdateUser(options?: Omit<UseMutationOptions<User, ApiError, { id: string; data: Parameters<typeof usersApi.update>[1] }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
    ...options,
  });
}

/**
 * Hook to delete a user mutation
 */
export function useDeleteUser(options?: Omit<UseMutationOptions<void, ApiError, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    ...options,
  });
}

/**
 * Hook for register mutation
 */
export function useRegister(options?: Omit<UseMutationOptions<User, ApiError, Parameters<typeof authApi.register>[0]>, "mutationFn">) {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
}

/**
 * Hook to fetch all locations with optional pagination
 */
export function useLocations(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => locationsApi.getAll(params),
  });
}

/**
 * Hook to fetch a single location by ID
 */
export function useLocation(id: string) {
  return useQuery({
    queryKey: ["location", id],
    queryFn: () => locationsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a location mutation
 */
export function useCreateLocation(options?: Omit<UseMutationOptions<Location, ApiError, Parameters<typeof locationsApi.create>[0]>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    ...options,
  });
}

/**
 * Hook to update a location mutation
 */
export function useUpdateLocation(options?: Omit<UseMutationOptions<Location, ApiError, { id: string; data: Parameters<typeof locationsApi.update>[1] }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => locationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", variables.id] });
    },
    ...options,
  });
}

/**
 * Hook to delete a location mutation
 */
export function useDeleteLocation(options?: Omit<UseMutationOptions<void, ApiError, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    ...options,
  });
}
