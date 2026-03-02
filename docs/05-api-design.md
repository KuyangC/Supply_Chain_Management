# API Design

## 1. API Overview

**API Style:** REST
**Data Format:** JSON
**Authentication:** JWT Bearer Token
**Base URL:** `https://api.supplychain.example.com/v1`

---

## 2. Common Conventions

### 2.1 Request Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
Accept: application/json
```

### 2.2 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "sku",
        "message": "SKU is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### 2.3 Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no body |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token, insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business logic validation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### 2.4 Pagination

```http
GET /api/v1/products?page=1&limit=20&sort=name:asc
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2.5 Filtering

```http
GET /api/v1/products?category=electronics&status=active&min_price=100
```

### 2.6 Search

```http
GET /api/v1/products?q=laptop
```

---

## 3. Authentication API

### 3.1 Register

```http
POST /api/v1/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "operator"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "operator",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3.2 Login

```http
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "operator",
      "location": {
        "id": "...",
        "name": "Main Warehouse"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-22T10:30:00Z"
  }
}
```

### 3.3 Refresh Token

```http
POST /api/v1/auth/refresh
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-22T10:30:00Z"
  }
}
```

### 3.4 Logout

```http
POST /api/v1/auth/logout
```

**Response (204):** No content

---

## 4. Product API

### 4.1 List Products

```http
GET /api/v1/products
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20, max: 100) |
| sort | string | Sort field:order (e.g., name:asc) |
| q | string | Search query |
| category | string | Filter by category ID |
| status | string | Filter by status (active/inactive) |
| requires_batch | boolean | Filter by batch tracking requirement |
| requires_expiry | boolean | Filter by expiry tracking requirement |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sku": "PROD-001",
      "barcode": "8901234567890",
      "name": "Wireless Mouse",
      "category": {
        "id": "...",
        "name": "Electronics",
        "code": "ELEC"
      },
      "unit": "pcs",
      "weight": 0.15,
      "weightUnit": "kg",
      "minStockLevel": 10,
      "maxStockLevel": 100,
      "requiresBatch": false,
      "requiresExpiry": false,
      "isActive": true,
      "totalStock": 150,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 4.2 Get Product

```http
GET /api/v1/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "PROD-001",
    "barcode": "8901234567890",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "category": {
      "id": "...",
      "name": "Electronics",
      "code": "ELEC"
    },
    "unit": "pcs",
    "weight": 0.15,
    "weightUnit": "kg",
    "dimensions": {
      "length": 10,
      "width": 6,
      "height": 4,
      "unit": "cm"
    },
    "imageUrls": ["https://cdn.example.com/product1.jpg"],
    "tags": ["wireless", "mouse", "electronics"],
    "minStockLevel": 10,
    "maxStockLevel": 100,
    "requiresBatch": false,
    "requiresExpiry": false,
    "isActive": true,
    "stockByLocation": [
      {
        "locationId": "...",
        "locationName": "Main Warehouse",
        "quantity": 100,
        "available": 90,
        "reserved": 10
      },
      {
        "locationId": "...",
        "locationName": "Store A",
        "quantity": 50,
        "available": 50,
        "reserved": 0
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 Create Product

```http
POST /api/v1/products
```

**Request:**
```json
{
  "sku": "PROD-001",
  "barcode": "8901234567890",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "categoryId": "...",
  "unit": "pcs",
  "weight": 0.15,
  "weightUnit": "kg",
  "dimensions": {
    "length": 10,
    "width": 6,
    "height": 4,
    "unit": "cm"
  },
  "tags": ["wireless", "mouse", "electronics"],
  "minStockLevel": 10,
  "maxStockLevel": 100,
  "requiresBatch": false,
  "requiresExpiry": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "PROD-001",
    "name": "Wireless Mouse",
    ...
  }
}
```

### 4.4 Update Product

```http
PATCH /api/v1/products/:id
```

**Request:** (partial update supported)
```json
{
  "name": "Wireless Mouse Pro",
  "description": "Updated description",
  "minStockLevel": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 4.5 Delete Product

```http
DELETE /api/v1/products/:id
```

**Response (204):** No content

### 4.6 Get Product History (Trace)

```http
GET /api/v1/products/:id/trace
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| fromDate | date | Start date |
| toDate | date | End date |
| location | string | Filter by location ID |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "...",
      "sku": "PROD-001",
      "name": "Wireless Mouse"
    },
    "trace": [
      {
        "transactionId": "TXF2024011500001",
        "type": "receipt",
        "from": null,
        "to": "Main Warehouse",
        "quantity": 100,
        "batchNumber": "BATCH-001",
        "timestamp": "2024-01-01T10:00:00Z",
        "notes": "Initial stock"
      },
      {
        "transactionId": "TXF2024011500002",
        "type": "transfer",
        "from": "Main Warehouse",
        "to": "Store A",
        "quantity": 30,
        "batchNumber": "BATCH-001",
        "timestamp": "2024-01-10T14:30:00Z",
        "notes": "Stock replenishment"
      }
    ]
  }
}
```

---

## 5. Inventory API

### 5.1 Get Inventory

```http
GET /api/v1/inventory
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| location | string | Filter by location ID |
| product | string | Filter by product ID |
| lowStock | boolean | Only show low stock items |
| expiring | boolean | Only show expiring items |
| page | integer | Page number |
| limit | integer | Items per page |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "product": {
        "id": "...",
        "sku": "PROD-001",
        "name": "Wireless Mouse"
      },
      "location": {
        "id": "...",
        "name": "Main Warehouse",
        "type": "warehouse"
      },
      "batchNumber": "BATCH-001",
      "expiryDate": null,
      "quantity": 100,
      "reserved": 10,
      "available": 90,
      "costPrice": 15.00
    }
  ],
  "pagination": { ... }
}
```

### 5.2 Get Product Stock Across Locations

```http
GET /api/v1/inventory/product/:productId
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "...",
      "sku": "PROD-001",
      "name": "Wireless Mouse"
    },
    "totalStock": 150,
    "totalAvailable": 140,
    "totalReserved": 10,
    "locations": [
      {
        "locationId": "...",
        "locationName": "Main Warehouse",
        "quantity": 100,
        "available": 90,
        "reserved": 10,
        "batches": [
          {
            "batchNumber": "BATCH-001",
            "quantity": 50,
            "expiryDate": null
          },
          {
            "batchNumber": "BATCH-002",
            "quantity": 50,
            "expiryDate": "2024-12-31"
          }
        ]
      },
      {
        "locationId": "...",
        "locationName": "Store A",
        "quantity": 50,
        "available": 50,
        "reserved": 0,
        "batches": []
      }
    ]
  }
}
```

### 5.3 Adjust Stock

```http
POST /api/v1/inventory/adjust
```

**Request:**
```json
{
  "productId": "...",
  "locationId": "...",
  "adjustmentType": "increase",
  "quantity": 10,
  "batchNumber": "BATCH-003",
  "expiryDate": "2024-12-31",
  "reason": "Stock correction",
  "costPrice": 15.00
}
```

**adjustmentType options:** `increase`, `decrease`, `damage`, `loss`, `return`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXA2024011500001",
    "inventory": {
      "id": "...",
      "quantity": 110,
      "available": 100
    }
  }
}
```

### 5.4 Transfer Stock

```http
POST /api/v1/inventory/transfer
```

**Request:**
```json
{
  "productId": "...",
  "fromLocationId": "...",
  "toLocationId": "...",
  "quantity": 25,
  "batchNumber": "BATCH-001",
  "reason": "Store replenishment",
  "scheduledFor": "2024-01-16T09:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXF2024011500003",
    "status": "pending",
    "estimatedDelivery": "2024-01-16T14:00:00Z"
  }
}
```

---

## 6. Transaction & Shipment API

### 6.1 List Transactions

```http
GET /api/v1/transactions
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | integer | Page number |
| limit | integer | Items per page |
| type | string | Filter by type |
| status | string | Filter by status |
| product | string | Filter by product ID |
| fromLocation | string | Filter by source location |
| toLocation | string | Filter by destination |
| fromDate | date | Start date |
| toDate | date | End date |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "transactionId": "TXF2024011500001",
      "type": "transfer",
      "status": "in_transit",
      "product": {
        "id": "...",
        "sku": "PROD-001",
        "name": "Wireless Mouse"
      },
      "fromLocation": {
        "id": "...",
        "name": "Main Warehouse"
      },
      "toLocation": {
        "id": "...",
        "name": "Store A"
      },
      "quantity": 25,
      "batchNumber": "BATCH-001",
      "createdAt": "2024-01-15T10:00:00Z",
      "scheduledFor": "2024-01-16T09:00:00Z",
      "currentEvent": {
        "eventType": "picked_up",
        "location": "Main Warehouse",
        "timestamp": "2024-01-15T14:00:00Z"
      }
    }
  ],
  "pagination": { ... }
}
```

### 6.2 Get Transaction Details

```http
GET /api/v1/transactions/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "transactionId": "TXF2024011500001",
    "type": "transfer",
    "status": "in_transit",
    "product": {
      "id": "...",
      "sku": "PROD-001",
      "name": "Wireless Mouse",
      "image": "https://cdn.example.com/product1.jpg"
    },
    "fromLocation": {
      "id": "...",
      "name": "Main Warehouse",
      "address": {
        "street": "123 Industrial Ave",
        "city": "Jakarta",
        "country": "Indonesia"
      },
      "contact": {
        "name": "John Warehouse",
        "phone": "+62-812-3456-7890"
      }
    },
    "toLocation": {
      "id": "...",
      "name": "Store A",
      "address": { ... }
    },
    "quantity": 25,
    "batchNumber": "BATCH-001",
    "reason": "Store replenishment",
    "referenceNumber": "PO-2024-001",
    "createdAt": "2024-01-15T10:00:00Z",
    "scheduledFor": "2024-01-16T09:00:00Z",
    "completedAt": null,
    "createdBy": {
      "id": "...",
      "name": "Admin User"
    },
    "events": [
      {
        "id": "...",
        "eventType": "created",
        "eventStatus": "pending",
        "location": "Main Warehouse",
        "notes": "Transaction created",
        "createdAt": "2024-01-15T10:00:00Z",
        "createdBy": {
          "name": "Admin User"
        }
      },
      {
        "id": "...",
        "eventType": "confirmed",
        "eventStatus": "confirmed",
        "location": "Main Warehouse",
        "notes": "Shipment confirmed",
        "createdAt": "2024-01-15T11:00:00Z",
        "createdBy": {
          "name": "Warehouse Manager"
        }
      },
      {
        "id": "...",
        "eventType": "picked_up",
        "eventStatus": "in_transit",
        "location": "Main Warehouse",
        "geoLat": -6.2088,
        "geoLng": 106.8456,
        "notes": "Picked up by courier",
        "createdAt": "2024-01-15T14:00:00Z",
        "createdBy": {
          "name": "Courier"
        }
      }
    ],
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:00:00Z",
        "location": "Main Warehouse",
        "completed": true
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-15T11:00:00Z",
        "location": "Main Warehouse",
        "completed": true
      },
      {
        "status": "picked_up",
        "timestamp": "2024-01-15T14:00:00Z",
        "location": "Main Warehouse",
        "completed": true
      },
      {
        "status": "in_transit",
        "timestamp": null,
        "location": null,
        "completed": false
      },
      {
        "status": "delivered",
        "timestamp": null,
        "location": "Store A",
        "completed": false
      }
    ]
  }
}
```

### 6.3 Create Transaction

```http
POST /api/v1/transactions
```

**Request:**
```json
{
  "type": "transfer",
  "productId": "...",
  "fromLocationId": "...",
  "toLocationId": "...",
  "quantity": 25,
  "batchNumber": "BATCH-001",
  "reason": "Store replenishment",
  "referenceNumber": "PO-2024-001",
  "scheduledFor": "2024-01-16T09:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "transactionId": "TXF2024011500001",
    "status": "pending",
    ...
  }
}
```

### 6.4 Update Transaction Status

```http
PATCH /api/v1/transactions/:id/status
```

**Request:**
```json
{
  "status": "in_transit",
  "notes": "Shipment picked up"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 6.5 Add Tracking Event

```http
POST /api/v1/transactions/:id/events
```

**Request:**
```json
{
  "eventType": "in_transit",
  "eventStatus": "in_transit",
  "locationId": "...",
  "geoLat": -6.2088,
  "geoLng": 106.8456,
  "temperature": 25.5,
  "notes": "Shipment in transit to destination"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "eventType": "in_transit",
    "createdAt": "2024-01-15T15:30:00Z"
  }
}
```

### 6.6 Get Transaction Events

```http
GET /api/v1/transactions/:id/events
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "eventType": "created",
      "eventStatus": "pending",
      "location": {
        "id": "...",
        "name": "Main Warehouse"
      },
      "geoLat": -6.2088,
      "geoLng": 106.8456,
      "temperature": null,
      "notes": "Transaction created",
      "attachments": [],
      "createdAt": "2024-01-15T10:00:00Z",
      "createdBy": {
        "id": "...",
        "name": "Admin User"
      }
    }
  ]
}
```

---

## 7. Location API

### 7.1 List Locations

```http
GET /api/v1/locations
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | Filter by type |
| status | string | Filter by status (active/inactive) |
| search | string | Search by name/code |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Main Warehouse",
      "code": "WH-001",
      "type": "warehouse",
      "address": {
        "street": "123 Industrial Ave",
        "city": "Jakarta",
        "state": "DKI Jakarta",
        "country": "Indonesia",
        "postalCode": "12345"
      },
      "geoLat": -6.2088,
      "geoLng": 106.8456,
      "contact": {
        "name": "John Warehouse",
        "phone": "+62-812-3456-7890",
        "email": "warehouse@example.com"
      },
      "capacity": 10000,
      "isActive": true,
      "productCount": 150,
      "totalStock": 5000,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 7.2 Create Location

```http
POST /api/v1/locations
```

**Request:**
```json
{
  "name": "Main Warehouse",
  "code": "WH-001",
  "type": "warehouse",
  "address": {
    "street": "123 Industrial Ave",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "country": "Indonesia",
    "postalCode": "12345"
  },
  "geoLat": -6.2088,
  "geoLng": 106.8456,
  "contact": {
    "name": "John Warehouse",
    "phone": "+62-812-3456-7890",
    "email": "warehouse@example.com"
  },
  "capacity": 10000
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 8. Analytics API

### 8.1 Dashboard Overview

```http
GET /api/v1/analytics/dashboard
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| location | string | Filter by location ID |
| period | string | Period (today, week, month, year) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalProducts": 150,
      "totalLocations": 5,
      "totalStock": 5000,
      "lowStockCount": 12,
      "expiringCount": 5,
      "pendingShipments": 8,
      "inTransitShipments": 15
    },
    "inventoryValue": {
      "totalCost": 125000.00,
      "changePercent": 5.2
    },
    "shipmentStats": {
      "today": 25,
      "thisWeek": 150,
      "thisMonth": 600,
      "completionRate": 94.5
    },
    "topProducts": [
      {
        "productId": "...",
        "sku": "PROD-001",
        "name": "Wireless Mouse",
        "totalStock": 500,
        "turnoverRate": 8.5
      }
    ],
    "lowStockItems": [
      {
        "productId": "...",
        "sku": "PROD-005",
        "name": "USB Cable",
        "currentStock": 5,
        "minStockLevel": 20,
        "deficit": 15
      }
    ]
  }
}
```

### 8.2 Inventory Report

```http
GET /api/v1/analytics/inventory
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| location | string | Filter by location |
| category | string | Filter by category |
| period | string | Period |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalProducts": 150,
      "totalStock": 5000,
      "totalValue": 125000.00,
      "lowStockItems": 12,
      "overstockItems": 8,
      "expiringItems": 5
    },
    "byCategory": [
      {
        "category": "Electronics",
        "productCount": 50,
        "totalStock": 2000,
        "totalValue": 50000.00
      }
    ],
    "byLocation": [
      {
        "location": "Main Warehouse",
        "productCount": 150,
        "totalStock": 3000,
        "totalValue": 75000.00
      }
    ]
  }
}
```

### 8.3 Shipment Report

```http
GET /api/v1/analytics/shipments
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| location | string | Filter by location |
| status | string | Filter by status |
| fromDate | date | Start date |
| toDate | date | End date |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalShipments": 500,
      "completedShipments": 450,
      "pendingShipments": 30,
      "inTransitShipments": 15,
      "failedShipments": 5,
      "completionRate": 90.0,
      "averageDeliveryTime": 2.5
    },
    "byType": [
      {
        "type": "transfer",
        "count": 350,
        "percentage": 70.0
      },
      {
        "type": "receipt",
        "count": 100,
        "percentage": 20.0
      }
    ],
    "byStatus": [
      {
        "status": "delivered",
        "count": 450,
        "percentage": 90.0
      }
    ]
  }
}
```

---

## 9. Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE` | Resource already exists |
| `INSUFFICIENT_STOCK` | Not enough stock available |
| `INVALID_LOCATION` | Invalid location for operation |
| `INVALID_BATCH` | Invalid batch number |
| `EXPIRED_PRODUCT` | Product has expired |
| `INVALID_TRANSACTION` | Invalid transaction state |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

---

## 10. Rate Limiting

| Plan | Limit |
|------|-------|
| Free | 100 requests/hour |
| Basic | 1,000 requests/hour |
| Pro | 10,000 requests/hour |
| Enterprise | Unlimited |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1705305600
```
