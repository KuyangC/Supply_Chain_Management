# UI Design Specification

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Summary cards, charts, recent activities |
| Products | `/products` | Product list, create, edit, detail |
| Inventory | `/inventory` | Stock overview, adjust, transfer |
| Shipments | `/shipments` | Shipment list, create, tracking |
| Users | `/users` | User list, create, edit (admin/manager only) |
| Analytics & Reports | `/analytics` | Reports with charts, export PDF/Excel/CSV |
| Event Logs | `/event-logs` | Transaction events, audit trail |

---

## 1. Dashboard (`/`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Summary Cards (6 columns)                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Products│ │Locs  │ │Shipment│ │Low  │ │Expiring│ │InTransit│
│  │  150  │ │  5   │ │  25   │ │Stock│ │ Items  │ │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
├─────────────────────────────────────────────────────────────┤
│  Charts (2 columns)                                          │
│  ┌─────────────────────┐ ┌─────────────────────┐            │
│  │  Inventory Trend    │ │  Shipment Status    │            │
│  │  (Line Chart)       │ │  (Donut Chart)      │            │
│  └─────────────────────┘ └─────────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Recent Shipments Table                                      │
│  ┌──────┬──────┬──────┬──────┬──────┬────────┐            │
│  │ID    │From  │To    │Product│Status│Date    │            │
│  ├──────┼──────┼──────┼──────┼──────┼────────┤            │
│  │TXF...│WH001 │StoreA│Mouse  │InTr. │Jan 15  │            │
│  └──────┴──────┴──────┴──────┴──────┴────────┘            │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- SummaryCard: `{ label, value, icon, trend }`
- Chart: Line, Donut, Bar
- Table: Recent shipments (5 rows)

---

## 2. Products (`/products`)

**List Page:**
```
┌─────────────────────────────────────────────────────────────┐
│  Products              [+ Add Product]    [Search] [Filter] │
├──────┬──────┬──────┬──────┬──────┬──────┬────────────────────┤
│  SKU │ Name │ Cat. │ Unit │Stock │Status│    Actions          │
├──────┼──────┼──────┼──────┼──────┼──────┼────────────────────┤
│PROD-1│Mouse │Elec  │ pcs  │ 150  │Active│[View] [Edit] [Del] │
│PROD-2│Cable │Elec  │ pcs  │  5   │Active│[View] [Edit] [Del] │
└──────┴──────┴──────┴──────┴──────┴──────┴────────────────────┘
│                          [Pagination]                        │
└─────────────────────────────────────────────────────────────┘
```

**Form Fields:**
```
Create/Edit Product:
┌─────────────────────────────────────────────────────────────┐
│  SKU *              [__________] (auto or manual)           │
│  Barcode            [__________]                             │
│  Name *             [________________]                      │
│  Category           [Select Category ▼]                     │
│  Unit               [pcs ▼]                                 │
│  Min Stock Level    [____]                                  │
│  Max Stock Level    [____]                                  │
│  Batch Tracking     [x] Toggle                              │
│  Expiry Tracking    [ ] Toggle                              │
│  Tags               [Add tags...]                           │
│  Description        [Textarea]                              │
│                                                             │
│  [Cancel]                              [Save]               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Inventory (`/inventory`)

**Overview:**
```
┌─────────────────────────────────────────────────────────────┐
│  Inventory     [Location: All ▼] [Search] [Low Stock] [Exp]│
├─────────────────────────────────────────────────────────────┤
│  Product     │Location │Batch   │Qty │Avail│Expiry │Actions│
├─────────────┼─────────┼─────────┼────┼─────┼───────┼───────┤
│Wireless Mouse│WH-001  │BATCH-1  │100 │ 90 │       │[Adj][Tr]│
│Wireless Mouse│Store-A │BATCH-1  │ 50 │ 50 │       │[Adj][Tr]│
│USB Cable     │WH-001  │BATCH-2  │  5 │  5 │Dec-24 │[Adj][Tr]│
└─────────────────────────────────────────────────────────────┘
```

**Adjust Stock Form:**
```
┌─────────────────────────────────────────────────────────────┐
│  Adjust Stock                                               │
│  Product *        [Search product...]                      │
│  Location *       [Select location ▼]                      │
│  Type *           [Increase ▼] (decrease, damage, loss)    │
│  Quantity *       [____]                                   │
│  Batch Number     [____]                                   │
│  Reason *         [________________]                      │
│  Cost Price       [____]                                   │
│                                                             │
│  [Cancel]                              [Adjust Stock]       │
└─────────────────────────────────────────────────────────────┘
```

**Transfer Stock Form:**
```
┌─────────────────────────────────────────────────────────────┐
│  Transfer Stock                                             │
│  Product *        [Search product...]                      │
│  From Location *  [Select location ▼]                      │
│  To Location *    [Select location ▼]                      │
│  Quantity *       [____]                                   │
│  Batch Number     [____]                                   │
│  Scheduled Date   [Pick date]                              │
│  Reason           [________________]                      │
│                                                             │
│  [Cancel]                              [Transfer]           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Shipments (`/shipments`)

**List Page:**
```
┌─────────────────────────────────────────────────────────────┐
│  Shipments       [+ New] [Search] [Filter Status ▼]        │
├──────┬──────┬──────┬──────┬──────┬──────┬────────────────────┤
│  ID  │ From │ To   │Prod  │ Qty  │Status│    Actions          │
├──────┼──────┼──────┼──────┼──────┼──────┼────────────────────┤
│TXF001│WH-001│StoreA│Mouse │  25  │[InTr.]│[View] [Track]      │
│TXF002│WH-001│StoreB│Cable │  50  │[Pend] │[View] [Track]      │
└──────┴──────┴──────┴──────┴──────┴──────┴────────────────────┘
```

**Status Badge Colors:**
- Pending = Gray
- Confirmed = Blue
- Picked Up = Yellow
- In Transit = Orange
- Delivered = Green
- Failed/Cancelled = Red

**Create Shipment Form:**
```
┌─────────────────────────────────────────────────────────────┐
│  Create Shipment                                            │
│  From Location *   [Select location ▼]                     │
│  To Location *     [Select location ▼]                     │
│                                                             │
│  Products:                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Product *    [Select product ▼]                    │   │
│  │ Quantity *    [____]                                │   │
│  │ Batch         [____]                                │   │
│  │                                    [+ Add Product] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Reference Number   [__________]                           │
│  Scheduled Date    [Pick date]                             │
│  Notes             [________________]                     │
│                                                             │
│  [Cancel]                              [Create Shipment]    │
└─────────────────────────────────────────────────────────────┘
```

**Detail & Tracking:**
```
┌─────────────────────────────────────────────────────────────┐
│  Shipment: TXF2024011500001                                 │
│                                                             │
│  Status:                                                   │
│  ┌──────┐ → ┌──────┐ → ┌──────┐ → ┌──────┐ → ┌──────┐    │
│  │Pending│ → │Confirm│ → │PickUp│ → │InTran│ → │Deliver│   │
│  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘    │
│               ✓          ✓          ✓         •            │
│                                                             │
│  From: Main Warehouse          To: Store A                  │
│  Product: Wireless Mouse      Qty: 25                       │
│                                                             │
│  Timeline:                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ● Jan 15 10:00  Created  - Warehouse    John D.     │   │
│  │ ● Jan 15 11:00  Confirmed - Warehouse    Jane S.     │   │
│  │ ● Jan 15 14:00  Picked Up - Warehouse    Courier     │   │
│  │ ○ Jan 15 15:30  In Transit - -6.208, 106.845         │   │
│  │ ○ TBD          Delivered - Store A                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [+ Add Event]                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Users (`/users`)

**List Page:**
```
┌─────────────────────────────────────────────────────────────┐
│  Users            [+ Add User]    [Search] [Role ▼]        │
├──────────┬─────────────┬──────┬───────────┬────────────────┤
│  Name    │ Email       │ Role │ Location │    Actions      │
├──────────┼─────────────┼──────┼───────────┼────────────────┤
│John Doe  │john@...     │Admin │WH-001    │[View] [Edit]    │
│Jane Smith│jane@...     │Mgr   │Store-A   │[View] [Edit]    │
└──────────┴─────────────┴──────┴───────────┴────────────────┘
```

**Form Fields:**
```
Create/Edit User:
┌─────────────────────────────────────────────────────────────┐
│  Name *            [________________]                      │
│  Email *           [________________]                      │
│  Password *        [________________] (create only)         │
│  Role *           [Admin ▼] (manager, operator, viewer)   │
│  Location         [Select location ▼]                     │
│  Status           [Active ▼]                              │
│                                                             │
│  [Cancel]                              [Save]               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Analytics & Reports (`/analytics`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Date Range: This Month ▼] [Location: All ▼] [Export ▼]   │
├─────────────────────────────────────────────────────────────┤
│  Summary Cards                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Inventory │Shipments │Complet. │Avg.Deliv.│            │
│  │  Value   │   500    │  Rate   │   Time   │            │
│  │ $125,000 │          │  94.5%  │  2.5d    │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  Charts                                                    │
│  ┌─────────────────────┐ ┌─────────────────────┐            │
│  │  Inventory by       │ │  Shipment Trends    │            │
│  │  Category (Pie)     │ │  (Line)             │            │
│  └─────────────────────┘ └─────────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Inventory Report Table                                    │
│  ┌──────────┬──────┬────────┬────────┬────────┬────────┐  │
│  │Product   │Category│Stock   │Value   │Low     │Expiring│  │
│  ├──────────┼──────┼────────┼────────┼────────┼────────┤  │
│  │Mouse     │Elec   │  150   │ $2,250 │   No   │   No   │  │
│  │Cable     │Elec   │    5   │   $50  │  Yes   │   No   │  │
│  └──────────┴──────┴────────┴────────┴────────┴────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Export Options:**
- Export as PDF
- Export as Excel (XLSX)
- Export as CSV

---

## 7. Event Logs (`/event-logs`)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Event Logs    [Event Type: All ▼] [Date] [Search]         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔵 Jan 15, 2024                                       │   │
│  │                                                       │   │
│  │ ● 15:30  In Transit    TXF001                       │   │
│  │    Location: -6.2088, 106.8456                      │   │
│  │    By: Courier    |  Temp: 25°C                     │   │
│  │    Notes: Shipment picked up                        │   │
│  │                                                       │   │
│  │ ● 14:00  Picked Up     TXF001                       │   │
│  │    Location: Main Warehouse                         │   │
│  │    By: Warehouse Manager                            │   │
│  │                                                       │   │
│  │ ● 11:00  Confirmed      TXF001                       │   │
│  │    Location: Main Warehouse                         │   │
│  │    By: Admin                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔵 Jan 14, 2024                                       │   │
│  │                                                       │   │
│  │ ● 16:00  Delivered      TXF995                       │   │
│  │    Location: Store B                                │   │
│  │    By: Store Manager                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Load More]                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Shared Components

### Navigation (Sidebar)
```
┌─────────────────┐
│ 🏠 Dashboard    │
│ 📦 Products     │
│ 📦 Inventory    │
│ 🚚 Shipments    │
│ 👥 Users        │
│ 📊 Analytics    │
│ 📜 Event Logs   │
│                 │
│ ⚙️ Settings    │
│ 🚪 Logout      │
└─────────────────┘
```

### Status Badge Colors
| Status | Color |
|--------|-------|
| Active / Delivered | Green |
| Pending | Gray |
| In Progress / In Transit | Blue |
| Warning / Low Stock | Yellow |
| Error / Failed / Cancelled | Red |
| Confirmed | Indigo |

### Common Form Components
- Input: text, number, email
- Select / Dropdown
- Date Picker
- Textarea
- Toggle / Switch
- Checkbox

### Table Components
- Sortable columns
- Pagination
- Row actions (View, Edit, Delete)
- Checkbox selection

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Mapbox (optional, for Phase 2)
- **Icons**: Lucide React
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **State**: React Query (TanStack Query)
