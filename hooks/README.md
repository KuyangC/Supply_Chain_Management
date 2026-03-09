# API Data Fetching Hooks

This directory contains custom hooks for fetching data from the backend API using TanStack Query.

## Available Hooks

### Product Hooks
- `useProducts(params)` - Fetch all products with pagination
- `useProduct(id)` - Fetch a single product by ID
- `useCreateProduct()` - Mutation for creating products
- `useUpdateProduct()` - Mutation for updating products
- `useDeleteProduct()` - Mutation for deleting products

### Inventory Hooks
- `useInventory(params)` - Fetch all inventory items with filters
- `useInventoryItem(id)` - Fetch a single inventory item by ID
- `useCreateInventory()` - Mutation for creating inventory items
- `useUpdateInventory()` - Mutation for updating inventory items

### Shipment Hooks
- `useShipments(params)` - Fetch all shipments with pagination
- `useShipment(id)` - Fetch a single shipment by ID
- `useCreateShipment()` - Mutation for creating shipments
- `useUpdateShipment()` - Mutation for updating shipments
- `useDeleteShipment()` - Mutation for deleting shipments

### User Hooks
- `useUsers(params)` - Fetch all users with pagination
- `useUser(id)` - Fetch a single user by ID
- `useCreateUser()` - Mutation for creating users
- `useUpdateUser()` - Mutation for updating users
- `useDeleteUser()` - Mutation for deleting users

### Auth Hooks
- `useRegister()` - Mutation for user registration

## Usage Pattern

```tsx
"use client";

import { useProducts } from "@/hooks/use-api-data";
import { TableLoading, TableError, TableEmpty } from "@/components/shared/table-states";

export default function ProductsPage() {
  const { data: products = [], isLoading, error, refetch } = useProducts();

  return (
    <div>
      {isLoading ? (
        <TableLoading colSpan={8} />
      ) : error ? (
        <TableError
          colSpan={8}
          message={error.message}
          onRetry={() => refetch()}
        />
      ) : products.length === 0 ? (
        <TableEmpty colSpan={8} message="No products found" />
      ) : (
        // Render data
      )}
    </div>
  );
}
```

## Error Handling

All hooks handle `ApiError` from the API client. The error includes:
- `message` - Human-readable error message
- `status` - HTTP status code
- `data` - Additional error data from the backend
