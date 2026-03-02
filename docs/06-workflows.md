# Business Workflows & Flowcharts

## Table of Contents

1. [User Authentication Flow](#1-user-authentication-flow)
2. [Product Management Flow](#2-product-management-flow)
3. [Inventory Management Flow](#3-inventory-management-flow)
4. [Shipment & Tracking Flow](#4-shipment--tracking-flow)
5. [Stock Transfer Flow](#5-stock-transfer-flow)
6. [Product Traceability Flow](#6-product-traceability-flow)
7. [Alert Generation Flow](#7-alert-generation-flow)
8. [Reporting Flow](#8-reporting-flow)

---

## 1. User Authentication Flow

### 1.1 Login Flow

```
┌─────────┐
│   User  │
└────┬────┘
     │
     │ 1. Enter email & password
     ▼
┌─────────────────┐
│   Login Page    │
└────┬────────────┘
     │
     │ 2. Submit credentials
     ▼
┌─────────────────┐     ┌─────────────────┐
│  API Gateway    │────▶│   Validate      │
└────┬────────────┘     │  Email Format   │
     │                 └────┬────────────┘
     │                      │
     │                 Valid?
     │                      │
     │            ┌─────────┴─────────┐
     │            │                   │
     │          Yes                  No
     │            │                   │
     ▼            ▼                   ▼
┌─────────────────┐     ┌─────────────────┐
│   Check User    │     │   Return Error  │
│   in Database   │     │  "Invalid       │
└────┬────────────┘     │   Email"        │
     │                 └─────────────────┘
     │
     │ User exists?
     │
     ├─────────────┬─────────────┐
     │             │             │
    Yes           No            │
     │             │             │
     ▼             ▼             │
┌─────────┐   ┌─────────┐       │
│Verify   │   │Return   │       │
│Password │   │Error    │       │
└────┬────┘   │"User    │       │
     │       │Not      │       │
     │       │Found"   │       │
     │       └─────────┘       │
     │                          │
 Match?                         │
     │                          │
┌────┴────┐                     │
│         │                     │
│  Yes    │    No               │
│    │    │     │              │
│    ▼    │     ▼              │
│┌───────┐│  ┌─────────┐       │
││Generate││  │Return   │       │
││JWT    ││  │Error    │       │
││Token  ││  │"Wrong   │       │
│└───┬───┘│  │Password"│       │
│    │   │  └─────────┘       │
│    ▼   │                     │
│┌───────┐│                     │
││Return ││                     │
││Token  ││                     │
││& User ││                     │
││Info   ││                     │
└────┬───┘└─────────────────────┘
     │
     ▼
┌─────────┐
│  User   │
│ Logged  │
│   In    │
└─────────┘
```

### 1.2 Registration Flow

```
┌─────────┐
│   User  │
└────┬────┘
     │
     │ 1. Fill registration form
     ▼
┌─────────────────┐
│ Registration    │
│    Form         │
└────┬────────────┘
     │
     │ 2. Submit data
     ▼
┌─────────────────┐
│   Validate      │
│   Input         │
└────┬────────────┘
     │
     │ Valid?
     │
     ├──────────────┬──────────────┐
     │              │              │
    Yes           No             │
     │              │              │
     ▼              ▼              │
┌─────────┐   ┌─────────┐        │
│Check    │   │Return   │        │
│Email    │   │Error    │        │
│Unique   │   │Message  │        │
└────┬────┘   └─────────┘        │
     │                          │
     │ Email unique?            │
     │                          │
     ├───────────┬──────────────┤
     │           │              │
    Yes        No              │
     │           │              │
     ▼           ▼              │
┌─────────┐ ┌─────────┐        │
│Hash     │ │Return   │        │
│Password │ │Error    │        │
└────┬────┘ │"Email   │        │
     │      │Already  │        │
     │      │Exists"  │        │
     │      └─────────┘        │
     │                          │
     ▼                          │
┌─────────┐                     │
│Create   │                     │
│User     │                     │
│Record   │                     │
└────┬────┘                     │
     │                          │
     ▼                          │
┌─────────┐                     │
│Generate │                     │
│JWT      │                     │
│Token    │                     │
└────┬────┘                     │
     │                          │
     ▼                          │
┌─────────┐                     │
│Return   │                     │
│Token &  │                     │
│User Data│                     │
└─────────┘──────────────────────┘
     │
     ▼
┌─────────┐
│Login    │
│Success │
└─────────┘
```

---

## 2. Product Management Flow

### 2.1 Create Product Flow

```
┌─────────┐
│ Manager │
└────┬────┘
     │
     │ 1. Click "Add Product"
     ▼
┌─────────────────┐
│  Product Form   │
│  (Empty)        │
└────┬────────────┘
     │
     │ 2. Fill product details
     ▼
┌─────────────────┐
│  Input Data:    │
│  - SKU          │
│  - Name         │
│  - Category     │
│  - Unit         │
│  - Batch Track  │
│  - Expiry Track │
└────┬────────────┘
     │
     │ 3. Submit
     ▼
┌─────────────────┐
│   Client Side   │
│   Validation    │
└────┬────────────┘
     │
     │ Valid?
     │
     ├──────────────┬──────────────┐
     │              │              │
    Yes           No             │
     │              │              │
     ▼              ▼              │
┌─────────┐   ┌─────────┐        │
│Send to  │   │Show     │        │
│API      │   │Validation│       │
│         │   │Errors   │        │
└────┬────┘   └─────────┘        │
     │                          │
     ▼                          │
┌─────────────────┐             │
│  Server Side    │             │
│   Validation    │             │
└────┬────────────┘             │
     │                          │
     │ Valid?                  │
     │                          │
     ├──────────────┬──────────┤
     │              │          │
    Yes           No          │
     │              │          │
     ▼              ▼          │
┌─────────┐   ┌─────────┐     │
│Check SKU│   │Return   │     │
│Unique   │   │422 Error│     │
└────┬────┘   └─────────┘     │
     │                          │
     │ SKU unique?             │
     │                          │
     ├────────────┬────────────┤
     │            │            │
    Unique     Duplicate       │
     │            │            │
     ▼            ▼            │
┌─────────┐  ┌─────────┐      │
│Create   │  │Return   │      │
│Product  │  │409 Error│      │
│Record   │  │"SKU     │      │
└────┬────┘  │Exists"  │      │
     │      └─────────┘      │
     │                          │
     ▼                          │
┌─────────┐                     │
│Return   │                     │
│201      │                     │
│Success  │                     │
└────┬────┘                     │
     │                          │
     ▼                          │
┌─────────┐                     │
│Show     │                     │
│Success  │                     │
│Message  │                     │
└─────────┘──────────────────────┘
```

### 2.2 Product Search Flow

```
┌─────────┐
│   User  │
└────┬────┘
     │
     │ 1. Enter search query
     ▼
┌─────────────────┐
│  Search Input   │
│  (Debounce 300ms)│
└────┬────────────┘
     │
     │ 2. API Call: GET /products?q=query
     ▼
┌─────────────────┐
│    API          │
│  ┌───────────┐  │
│  │ Parse     │  │
│  │ Query     │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         ▼
    ┌─────────┐
    │ Check   │
    │ Cache   │
    │(Redis)  │
    └────┬────┘
         │
         │ Cached?
         │
         ├──────────┬──────────┐
         │          │          │
        Yes        No         │
         │          │          │
         ▼          ▼          │
    ┌─────────┐ ┌─────────┐   │
    │Return   │ │Search   │   │
    │Cached   │ │Database│   │
    │Results  │ │         │   │
    └────┬────┘ └────┬────┘   │
         │           │         │
         │           │         │
         │           ▼         │
         │    ┌──────────┐    │
         │    │Store in  │    │
         │    │Cache     │    │
         │    │(5 min)  │    │
         │    └────┬─────┘    │
         │         │          │
         └─────────┼──────────┘
                   ▼
            ┌──────────┐
            │ Format   │
            │ Results  │
            └────┬─────┘
                 ▼
            ┌──────────┐
            │ Return   │
            │ JSON     │
            └────┬─────┘
                 │
                 ▼
            ┌──────────┐
            │ Display  │
            │ Results  │
            └──────────┘
```

---

## 3. Inventory Management Flow

### 3.1 Stock Adjustment Flow

```
┌─────────┐
│ Manager │
└────┬────┘
     │
     │ 1. Select product & location
     ▼
┌─────────────────┐
│  View Current   │
│  Stock Level    │
└────┬────────────┘
     │
     │ 2. Click "Adjust Stock"
     ▼
┌─────────────────┐
│  Adjustment     │
│  Form           │
└────┬────────────┘
     │
     │ 3. Select adjustment type
     ▼
┌─────────────────────────────────────┐
│  Adjustment Type:                   │
│  ┌─────────┐ ┌─────────┐           │
│  │Increase │ │Decrease │           │
│  └────┬────┘ └────┬────┘           │
│       │           │                │
│       └─────┬─────┘                │
│             │                      │
│  ┌─────────┐ ┌─────────┐           │
│  │ Damage  │ │  Loss   │           │
│  └────┬────┘ └────┬────┘           │
│       │           │                │
│       └───────────┴────────┘       │
│             │                     │
└─────────────┼─────────────────────┘
              │
              │ 4. Enter quantity & reason
              ▼
┌─────────────────────────────────────┐
│  Input:                             │
│  - Quantity                         │
│  - Reason                           │
│  - Batch Number (if applicable)     │
│  - Cost Price (if increase)         │
└─────────────┬───────────────────────┘
              │
              │ 5. Submit
              ▼
┌─────────────────────────────────────┐
│         Validation                  │
│  ┌─────────────────────────────┐   │
│  │ • Quantity must be > 0      │   │
│  │ • Reason required           │   │
│  │ • Batch required if enabled │   │
│  └──────────┬──────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ Valid?
              │
              ├──────────────┬──────────────┐
              │              │              │
             Yes           No             │
              │              │              │
              ▼              ▼              │
         ┌─────────┐   ┌─────────┐        │
         │Create   │   │Show     │        │
         │Adjustment│  │Error    │        │
         │Transaction│ │Message  │        │
         └────┬────┘   └─────────┘        │
              │                          │
              ▼                          │
         ┌─────────┐                     │
         │Update   │                     │
         │Inventory│                     │
         │Table    │                     │
         └────┬────┘                     │
              │                          │
              ▼                          │
         ┌─────────┐                     │
         │Log      │                     │
         │Audit    │                     │
         │Trail    │                     │
         └────┬────┘                     │
              │                          │
              ▼                          │
         ┌─────────┐                     │
         │Check    │                     │
         │Alerts   │                     │
         └────┬────┘                     │
              │                          │
              │ Low stock?              │
              │                          │
              ├─────────────┬───────────┤
              │             │           │
             Yes           No          │
              │             │           │
              ▼             │           │
         ┌─────────┐        │           │
         │Create   │        │           │
         │Alert    │        │           │
         └────┬────┘        │           │
              │             │           │
              └─────────────┼───────────┘
                            ▼
                     ┌──────────┐
                     │ Return   │
                     │ Success  │
                     │ Response │
                     └──────────┘
```

### 3.2 Low Stock Alert Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     System (Scheduled Job)                  │
│                     Runs every hour                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │  Query All   │
                      │  Products    │
                      │  with        │
                      │  min_stock   │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ For Each     │
                      │ Product:     │
                      │ Check Stock  │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ Compare:     │
                      │ current < min │
                      └──────┬───────┘
                             │
                             │ Low stock?
                             │
                             ├────────────┬────────────┐
                             │            │            │
                            Yes          No           │
                             │            │            │
                             ▼            │            │
                      ┌──────────────┐ │            │
                      │ Check if     │ │            │
                      │ Alert Exists ││            │
                      └──────┬───────┘│            │
                             │         │            │
                             │ Exists? │            │
                             │         │            │
                             ├────┬────┴────────────┤
                             │    │                 │
                            No   Yes              │
                             │    │                 │
                             ▼    ▼                 │
                      ┌─────────┐ ┌─────────┐      │
                      │Create   │ │Update  │       │
                      │New      │ │Existing│       │
                      │Alert    │ │Alert   │       │
                      └────┬────┘ └────┬────┘      │
                           └──┬────┬───┘            │
                              │    │                │
                              ▼    ▼                │
                       ┌─────────────────┐          │
                       │ Notify Users    │          │
                       │ (Email/Push)    │          │
                       └────────┬────────┘          │
                                │                   │
                                └───────────────────┤
                                                   ▼
                                            ┌──────────┐
                                            │ Continue │
                                            │ Next     │
                                            │ Product  │
                                            └──────────┘
```

---

## 4. Shipment & Tracking Flow

### 4.1 Create Shipment Flow

```
┌─────────┐
│ Manager │
└────┬────┘
     │
     │ 1. Click "Create Shipment"
     ▼
┌─────────────────┐
│  Shipment Form  │
└────┬────────────┘
     │
     │ 2. Select source location
     ▼
┌─────────────────┐
│  Select:        │
│  From Location  │
└────┬────────────┘
     │
     │ 3. Select destination
     ▼
┌─────────────────┐
│  Select:        │
│  To Location    │
└────┬────────────┘
     │
     │ 4. Add products
     ▼
┌─────────────────┐
│  For each       │
│  product:       │
│  - Select SKU   │
│  - Enter qty    │
│  - Select batch │
└────┬────────────┘
     │
     │ 5. Review & Submit
     ▼
┌─────────────────┐
│   Validation    │
│  ┌───────────┐  │
│  │• Source ≠ │  │
│  │  Dest     │  │
│  │• Qty > 0  │  │
│  │• Stock    │  │
│  │  available│  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ Valid?
         │
         ├──────────────┬──────────────┐
         │              │              │
        Yes           No             │
         │              │              │
         ▼              ▼              │
    ┌─────────┐   ┌─────────┐        │
    │Generate │   │Show     │        │
    │Shipment │   │Error    │        │
    │ID       │   │Message  │        │
    └────┬────┘   └─────────┘        │
         │                          │
         ▼                          │
    ┌─────────┐                     │
    │Create   │                     │
    │Transaction│                   │
    │Record   │                     │
    └────┬────┘                     │
         │                          │
         ▼                          │
    ┌─────────┐                     │
    │Reserve  │                     │
    │Stock    │                     │
    │(Update  │                     │
    │ reserved)│                    │
    └────┬────┘                     │
         │                          │
         ▼                          │
    ┌─────────┐                     │
    │Create   │                     │
    │Initial  │                     │
    │Event    │                     │
    └────┬────┘                     │
         │                          │
         ▼                          │
    ┌─────────┐                     │
    │Notify   │                     │
    │Relevant │                     │
    │Users    │                     │
    └────┬────┘                     │
         │                          │
         ▼                          │
    ┌─────────┐                     │
    │Return   │                     │
    │Success  │                     │
    └─────────┘──────────────────────┘
```

### 4.2 Shipment Status Update Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Shipment Lifecycle                      │
│                                                              │
│  ┌─────────┐   ┌─────────┐   ┌──────────┐   ┌───────────┐ │
│  │ PENDING │──▶│CONFIRMED│──▶│ PICKED_UP│──▶│IN_TRANSIT │ │
│  └─────────┘   └─────────┘   └──────────┘   └─────┬─────┘ │
│                                                   │        │
│                                                   │        │
│                                                   ▼        │
│                                            ┌───────────┐  │
│                                            │ DELIVERED │  │
│                                            └───────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

State Transition Details:

PENDING → CONFIRMED
┌─────────────┐      ┌─────────────┐
│   Source    │      │ Destination │
│  Warehouse  │      │    Store    │
│  Manager    │      │   Manager   │
└──────┬──────┘      └──────┬──────┘
       │                    │
       │ Confirm shipment    │
       │ ready              │
       ▼                    │
┌─────────────────┐         │
│ Stock reserved  │         │
│ Picking started │         │
└─────────────────┘         │
                            │ Receive
                            │ notification
                            ▼
                     ┌─────────────────┐
                     │ Expecting       │
                     │ shipment        │
                     └─────────────────┘

CONFIRMED → PICKED_UP
┌─────────────┐
│    Driver   │
└──────┬──────┘
       │
       │ Arrive at
       │ warehouse
       ▼
┌─────────────────┐
│ Scan shipment  │
│ documents      │
└──────┬─────────┘
       │
       │ Verify items
       ▼
┌─────────────────┐
│ Load vehicle   │
└──────┬─────────┘
       │
       │ Update status
       ▼
┌─────────────────┐
│ Status:        │
│ PICKED_UP      │
│ Location:      │
│ Warehouse      │
└─────────────────┘

PICKED_UP → IN_TRANSIT
┌─────────────┐
│    Driver   │
└──────┬──────┘
       │
       │ Start journey
       ▼
┌─────────────────┐
│ GPS tracking   │
│ active         │
└──────┬─────────┘
       │
       │ Periodic updates
       ▼
┌─────────────────┐
│ Status:        │
│ IN_TRANSIT     │
│ Location:      │
│ Current GPS    │
└─────────────────┘

IN_TRANSIT → DELIVERED
┌─────────────┐
│    Driver   │
└──────┬──────┘
       │
       │ Arrive at
       │ destination
       ▼
┌─────────────────┐
│ Receiver       │
│ verifies items │
└──────┬─────────┘
       │
       │ Sign/confirm
       ▼
┌─────────────────┐
│ Status:        │
│ DELIVERED      │
│ Stock updated  │
└─────────────────┘
```

### 4.3 Real-time Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Real-time Tracking                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────┐                    ┌─────────┐                    ┌─────────┐
│  Driver │                    │  API    │                    │ Manager │
│  Mobile │                    │ Server  │                    │  Web    │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │                              │                              │
     │ 1. Send location update       │                              │
     │─────────────────────────────▶│                              │
     │  POST /transactions/:id/events                           │
     │  {                          │                              │
     │    eventType: "location",   │                              │
     │    geoLat: -6.2088,         │                              │
     │    geoLng: 106.8456         │                              │
     │  }                          │                              │
     │                              │                              │
     │                              │ 2. Store event               │
     │                              │─────────────────────────────▶│
     │                              │  Database                    │
     │                              │                              │
     │                              │ 3. Broadcast via            │
     │                              │    WebSocket                │
     │                              │─────────────────────────────▶│
     │                              │                              │
     │                              │                      4. Update
     │                              │                      Dashboard
     │                              │                      Show
     │                              │                      New Location
     │                              │                              │
     │                     ┌────────┴────────┐                    │
     │                     │                 │                    │
     │                     ▼                 ▼                    │
     │              ┌──────────┐      ┌──────────┐                │
     │              │ Location │      │ Estimated│                │
     │              │  Marker  │      │   ETA   │                │
     │              │  on Map  │      │ Update  │                │
     │              └──────────┘      └──────────┘                │
     │                                                              │
     └──────────────────────────────────────────────────────────────┘

WebSocket Message Flow:

Server → Client
{
  "type": "shipment_update",
  "data": {
    "transactionId": "TXF2024011500001",
    "status": "in_transit",
    "location": {
      "lat": -6.2088,
      "lng": 106.8456,
      "address": "Jl. Sudirman, Jakarta"
    },
    "estimatedArrival": "2024-01-15T16:00:00Z",
    "timestamp": "2024-01-15T15:30:00Z"
  }
}
```

---

## 5. Stock Transfer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Stock Transfer Process                      │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: REQUEST
┌──────────────┐                    ┌──────────────┐
│ Source       │                    │ Destination  │
│ Warehouse    │                    │ Store        │
│   Manager    │                    │   Manager    │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
       │ 1. Receive stock request          │
       │◀──────────────────────────────────│
       │    "Need 50 units of PROD-001"    │
       │                                   │
       │ 2. Check availability             │
       ▼                                   │
┌──────────────────┐                      │
│  Query Inventory │                      │
│  Is stock >= 50? │                      │
└──────┬───────────┘                      │
       │                                   │
       │ Available?                        │
       ├───────────┬───────────────────────┤
       │           │                       │
      Yes         No                      │
       │           │                       │
       ▼           ▼                       │
┌──────────┐ ┌──────────┐                 │
│ Approve  │ │ Reject   │                 │
│ Request  │ │ Request  │                 │
└─────┬────┘ └────┬─────┘                 │
      │           │                         │
      │           │ 3. Notify              │
      └───────────┼───────────────────────▶│
                  │   "Request approved"   │
                  │                         │
                  │                         │

PHASE 2: PREPARATION
                  │                         │
                  │ 4. Create shipment      │
                  ▼                         │
         ┌────────────────┐                 │
         │ Create         │                 │
         │ Shipment       │                 │
         │ Record         │                 │
         └────────┬───────┘                 │
                  │                         │
                  │ 5. Reserve stock        │
                  ▼                         │
         ┌────────────────┐                 │
         │ Update         │                 │
         │ Inventory:     │                 │
         │ reserved += 50 │                 │
         └────────┬───────┘                 │
                  │                         │
                  │ 6. Notify picking team  │
                  ▼                         │
         ┌────────────────┐                 │
         │ Warehouse      │                 │
         │ Staff picks    │                 │
         │ items          │                 │
         └────────┬───────┘                 │
                  │                         │

PHASE 3: TRANSIT
                  │                         │
         ┌────────▼───────┐                 │
         │ Driver arrives │                 │
         │ Load vehicle   │                 │
         └────────┬───────┘                 │
                  │                         │
                  │ 7. Update status:       │
                  │    PICKED_UP           │
                  ▼                         │
         ┌────────────────┐                 │
         │ Status:        │                 │
         │ PICKED_UP      │                 │
         │ Reserved: 50   │                 │
         └────────┬───────┘                 │
                  │                         │
                  │ 8. In transit           │
                  ▼                         │
         ┌────────────────┐                 │
         │ GPS Tracking   │                 │
         │ Real-time      │                 │
         │ updates        │                 │
         └────────┬───────┘                 │
                  │                         │

PHASE 4: DELIVERY
                  │                         │
         ┌────────▼───────┐                 │
         │ Arrive at      │                 │
         │ destination    │                 │
         └────────┬───────┘                 │
                  │                         │
                  │ 9. Verify & receive     │
                  ▼                         ▼
         ┌────────────────────────────────────┐
         │ Receiver verifies items            │
         │ Counts: 50 units                   │
         │ Condition: Good                    │
         └────────┬───────────────────────────┘
                  │
                  │ 10. Confirm delivery
                  ▼
         ┌────────────────┐
         │ Status:        │
         │ DELIVERED      │
         └────────┬───────┘
                  │
                  │ 11. Update inventory
                  ▼
         ┌────────────────┐
         │ Source:        │
         │ quantity -= 50 │
         │                │
         │ Destination:    │
         │ quantity += 50 │
         │ reserved = 0   │
         └────────┬───────┘
                  │
                  │ 12. Complete transaction
                  ▼
         ┌────────────────┐
         │ Transaction    │
         │ Complete       │
         └────────────────┘
```

---

## 6. Product Traceability Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Product Traceability                          │
└─────────────────────────────────────────────────────────────────┘

User Request: "Show me the journey of this product"

┌─────────┐
│   User  │
└────┬────┘
     │
     │ 1. Scan/Enter SKU or Product ID
     ▼
┌─────────────────┐
│  GET /products/ │
│  :id/trace      │
└────┬────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Query Database                            │
│                                                              │
│  SELECT * FROM transactions                                  │
│  WHERE product_id = ?                                        │
│  ORDER BY created_at ASC                                     │
│                                                              │
│  SELECT * FROM transaction_events                            │
│  WHERE transaction_id IN (?)                                 │
│  ORDER BY created_at ASC                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Build Timeline                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Product: Wireless Mouse (PROD-001)                    │   │
│  │ Batch: BATCH-001                                     │   │
│  │ manufactured: 2024-01-01                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Timeline:                                                   │
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐ │
│  │ Factory │───▶│Warehouse│───▶│  Store  │───▶│ Customer│ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘ │
│      │             │              │              │          │
│      ▼             ▼              ▼              ▼          │
│  ┌─────────┐  ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│  │Created  │  │Received │   │Shipped  │   │Sold     │    │
│  │2024-01-01│  │2024-01-05│   │2024-01-10│   │2024-01-15│    │
│  └─────────┘  └─────────┘   └─────────┘   └─────────┘    │
│                                                              │
│  Details:                                                    │
│  • Temperature maintained: 18-25°C                          │
│  • Handlers: 3                                              │
│  • Transit time: 5 days                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Visual Display                           │
│                                                              │
│         [Timeline Visualization]                             │
│         ┌───┐    ┌───┐    ┌───┐    ┌───┐                   │
│    Factory──▶Warehouse──▶Store──▶Customer                   │
│         │        │         │        │                       │
│         ▼        ▼         ▼        ▼                       │
│      Jan 1    Jan 5    Jan 10    Jan 15                     │
│                                                              │
│         [Event Details on Click]                            │
│         • Location: Jakarta Factory                         │
│         • Handler: Production Team                          │
│         • Temperature: 22°C                                 │
│         • Notes: Quality inspection passed                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ Display  │
                   │ to User  │
                   └──────────┘
```

---

## 7. Alert Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Alert System                              │
└─────────────────────────────────────────────────────────────────┘

Scheduled Job: Every 15 minutes

┌──────────────────┐
│  Alert Engine    │
│  Starts          │
└────────┬─────────┘
         │
         │ Check all alert types
         ▼
┌───────────────────────────────────────────────────────────┐
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Low Stock   │  │ Expiry      │  │ Temperature│     │
│  │   Check     │  │   Check     │  │    Check    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │              │
│         ▼                ▼                ▼              │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐       │
│  │SELECT *   │    │SELECT *   │    │SELECT *   │       │
│  │FROM       │    │FROM       │    │FROM       │       │
│  │inventory  │    │inventory  │    │tx_events  │       │
│  │WHERE      │    │WHERE      │    │WHERE      │       │
│  │available  │    │expiry_date│    │temperature│       │
│  │ < min_stock│   │BETWEEN    │    │ > max_temp │       │
│  └─────┬─────┘    │NOW() AND  │    └─────┬─────┘       │
│        │          │NOW()+7days│          │              │
│        │          └─────┬─────┘          │              │
│        │                │                │              │
│        │                │                │              │
│        └────────────────┼────────────────┘              │
│                         │                                │
│                         ▼                                │
│              ┌───────────────────┐                       │
│              │ For each trigger: │                       │
│              │                   │                       │
│              │ 1. Check if       │                       │
│              │    alert exists   │                       │
│              │    (avoid dupes)  │                       │
│              │                   │                       │
│              │ 2. If new:        │                       │
│              │    Create alert   │                       │
│              │                   │                       │
│              │ 3. If exists:     │                       │
│              │    Update count/  │                       │
│              │    severity       │                       │
│              └─────────┬─────────┘                       │
│                        │                                 │
│                        ▼                                 │
│              ┌───────────────────┐                       │
│              │ Get affected      │                       │
│              │ users (by loc)    │                       │
│              └─────────┬─────────┘                       │
│                        │                                 │
│                        ▼                                 │
│              ┌───────────────────┐                       │
│              │ Send notification │                       │
│              │                   │                       │
│              │ • Email           │                       │
│              │ • Push notif      │                       │
│              │ • Dashboard badge │                       │
│              └─────────┬─────────┘                       │
│                        │                                 │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ Wait for │
                   │ next run │
                   └──────────┘
```

---

## 8. Reporting Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Report Generation                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Request report
     ▼
┌─────────────────┐
│ Report Options: │
│ • Type          │
│ • Date Range    │
│ • Location      │
│ • Category      │
│ • Format        │
└────┬────────────┘
     │
     │ 2. Submit request
     ▼
┌─────────────────┐
│   API Call:     │
│   POST /reports │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Validate Request│
│ ┌─────────────┐ │
│ │• Date valid │ │
│ │• Perms OK   │ │
│ └──────┬──────┘ │
└────────┼────────┘
         │
         │ Valid?
         │
         ├──────────┬──────────┐
         │          │          │
        Yes        No         │
         │          │          │
         ▼          ▼          │
    ┌─────────┐ ┌─────────┐   │
    │Queue    │ │Return   │   │
    │Report   │ │Error    │   │
    │Job      │ └─────────┘   │
    └────┬────┘               │
         │                    │
         ▼                    │
    ┌─────────────────┐       │
    │ Background Job  │       │
    │ (Message Queue) │       │
    └────────┬────────┘       │
             │                │
             ▼                │
    ┌─────────────────┐       │
    │ Query Database  │       │
    │ Aggregate Data  │       │
    └────────┬────────┘       │
             │                │
             ▼                │
    ┌─────────────────┐       │
    │ Process &       │       │
    │ Transform       │       │
    │ Format Data     │       │
    └────────┬────────┘       │
             │                │
             ▼                │
    ┌─────────────────┐       │
    │ Generate File   │       │
    │ • PDF           │       │
    │ • Excel         │       │
    │ • CSV           │       │
    └────────┬────────┘       │
             │                │
             ▼                │
    ┌─────────────────┐       │
    │ Save to Storage │       │
    └────────┬────────┘       │
             │                │
             ▼                │
    ┌─────────────────┐       │
    │ Update Status:  │       │
    │ COMPLETED      │       │
    └────────┬────────┘       │
             │                │
             │ Notify user    │
             │ (Email/Webhook)│
             └────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ User notified │
            │ Download link │
            └───────────────┘
```

---

## 9. Complete Order-to-Delivery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              End-to-End Supply Chain Flow                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│  Supplier   │
└──────┬──────┘
       │
       │ 1. Deliver raw materials
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Factory    │────▶│ Production  │────▶│ Quality    │
│  Receive    │     │ Process     │     │ Check      │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                       │
       │ Products passed QC                    │
       ▼                                       │
┌─────────────┐     ┌─────────────┐           │
│   Label     │────▶│   Package   │───────────┘
│   Batch     │     │   Items     │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Add to      │────▶│ Warehouse   │
│ Inventory   │     │ Storage     │
└──────┬──────┘     └──────┬──────┘
       │                   │
       │                   │ Stock available
       │                   │
       │         ┌─────────▼─────────┐
       │         │  Store Request    │
       │         │  Stock Transfer   │
       │         └─────────┬─────────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Create         │
       │         │  Shipment       │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Reserve Stock  │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Pick & Pack    │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Handover to    │
       │         │  Logistics      │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  In Transit     │
       │         │  (Tracking)     │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Arrive Store   │
       │         │  Receive Goods  │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Add to Store   │
       │         │  Inventory      │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Shelf Display  │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Customer       │
       │         │  Purchase       │
       │         └─────────┬───────┘
       │                   │
       │                   ▼
       │         ┌─────────────────┐
       │         │  Reduce Stock   │
       │         │  Complete Sale   │
       │         └─────────────────┘
       │
       └───────────────────────────┘
```

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `□` | Process/Action |
| `◇` | Decision/Condition |
| `▶` | Direction/Flow |
| `→` | Data Flow |
| `⬡` | Database |
| `○` | Start/End |
| `▣` | Parallel Process |

---

## Notes

1. All flows include error handling paths
2. Database writes are wrapped in transactions
3. Critical operations are logged for audit
4. Alerts are generated asynchronously
5. Real-time updates use WebSocket connections
