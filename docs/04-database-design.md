# Database Design

## 1. Database Overview

**Database Type:** Relational (PostgreSQL 16)
**Naming Convention:** snake_case
**Schema Strategy:** Single schema with logical separation by module

---

## 2. ER Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Categories  │───────│  Products   │───────│  Inventory  │
│             │ 1   N │             │ 1   N │             │
│ - id        │       │ - id        │       │ - id        │
│ - name      │       │ - sku       │       │ - quantity  │
│ - parent_id │       │ - name      │       │ - batch_no  │
└─────────────┘       │ - category_id│       │ - expiry   │
                      └─────────────┘       └─────────────┘
                             │ 1                    │ N
                             │                      │
                             ▼                      ▼
                      ┌─────────────┐       ┌─────────────┐
                      │Transactions │───────│  Locations  │
                      │             │ N   1 │             │
                      │ - id        │       │ - id        │
                      │ - product_id│       │ - name      │
                      │ - from_loc  │       │ - type      │
                      │ - to_loc    │       │ - address   │
                      │ - quantity  │       └─────────────┘
                      └─────────────┘
                             │ 1
                             │
                             ▼ N
                      ┌─────────────┐
                      │Transaction  │
                      │   Events    │
                      │             │
                      │ - id        │
                      │ - tx_id     │
                      │ - event_type│
                      │ - geo_lat   │
                      │ - geo_lng   │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│   Users     │──────│  Locations  │
│             │ N   1 │             │
│ - id        │       │             │
│ - email     │       │             │
│ - role      │       │             │
│ - location  │       │             │
└─────────────┘       └─────────────┘
```

---

## 3. Table Definitions

### 3.1 Users

Stores user accounts and authentication data.

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'operator',
    location_id     UUID REFERENCES locations(id) ON DELETE SET NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_id);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hash of password |
| name | VARCHAR(255) | Full name |
| role | ENUM | User's system role |
| location_id | UUID | Assigned location (nullable) |
| is_active | BOOLEAN | Account status |
| last_login_at | TIMESTAMP | Last successful login |
| metadata | JSONB | Flexible additional data |

---

### 3.2 Locations

Physical locations where inventory is stored or managed.

```sql
CREATE TABLE locations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50) UNIQUE NOT NULL,
    type            location_type NOT NULL,
    address         JSONB,
    geo_lat         DECIMAL(10, 8),
    geo_lng         DECIMAL(11, 8),
    contact_name    VARCHAR(255),
    contact_phone   VARCHAR(50),
    contact_email   VARCHAR(255),
    capacity        INTEGER, -- Maximum storage capacity
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE TYPE location_type AS ENUM ('warehouse', 'store', 'transit', 'supplier', 'factory');

CREATE INDEX idx_locations_code ON locations(code);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_active ON locations(is_active);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Location name |
| code | VARCHAR(50) | Unique location code |
| type | ENUM | Type of location |
| address | JSONB | Structured address data |
| geo_lat/lng | DECIMAL | GPS coordinates |
| capacity | INTEGER | Max storage capacity |
| is_active | BOOLEAN | Active status |

---

### 3.3 Categories

Hierarchical product categorization.

```sql
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(50) UNIQUE NOT NULL,
    parent_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
    level           INTEGER NOT NULL DEFAULT 0, -- Hierarchy depth
    path            VARCHAR(1000)[], -- Materialized path for queries
    description     TEXT,
    image_url       VARCHAR(500),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_categories_code ON categories(code);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Category name |
| code | VARCHAR(50) | Unique category code |
| parent_id | UUID | Parent category (for hierarchy) |
| level | INTEGER | Depth in hierarchy |
| path | ARRAY | Materialized path for efficient queries |
| is_active | BOOLEAN | Active status |

---

### 3.4 Products

Master product catalog.

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku             VARCHAR(50) UNIQUE NOT NULL,
    barcode         VARCHAR(100) UNIQUE,
    name            VARCHAR(255) NOT NULL,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    description     TEXT,
    unit            VARCHAR(50) NOT NULL DEFAULT 'pcs', -- e.g., pcs, kg, box
    weight          DECIMAL(10, 3), -- per unit
    weight_unit     VARCHAR(10) DEFAULT 'kg',
    dimensions      JSONB, -- {length, width, height, unit}
    image_urls      VARCHAR(500)[],
    tags            VARCHAR(100)[],
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    requires_batch  BOOLEAN NOT NULL DEFAULT false,
    requires_expiry BOOLEAN NOT NULL DEFAULT false,
    shelf_life_days INTEGER,
    storage_condition VARCHAR(100), -- e.g., 'cold', 'dry', 'frozen'
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Full text search
CREATE INDEX idx_products_search ON products USING GIN(
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, ''))
);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| sku | VARCHAR(50) | Unique Stock Keeping Unit |
| barcode | VARCHAR(100) | Barcode/QR code |
| name | VARCHAR(255) | Product name |
| category_id | UUID | Product category |
| unit | VARCHAR(50) | Unit of measurement |
| weight | DECIMAL | Weight per unit |
| dimensions | JSONB | Product dimensions |
| min/max_stock_level | INTEGER | Reorder thresholds |
| requires_batch | BOOLEAN | Requires batch tracking |
| requires_expiry | BOOLEAN | Requires expiry tracking |
| storage_condition | VARCHAR(100) | Special storage needs |

---

### 3.5 Inventory

Current inventory state per location and batch.

```sql
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id     UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    batch_number    VARCHAR(100),
    expiry_date     DATE,
    quantity        INTEGER NOT NULL DEFAULT 0,
    reserved_qty    INTEGER NOT NULL DEFAULT 0, -- Reserved for orders
    available_qty   INTEGER GENERATED ALWAYS AS (quantity - reserved_qty) STORED,
    cost_price      DECIMAL(10, 2),
    manufacturing_date DATE,
    received_date   DATE,
    location_details JSONB, -- e.g., {shelf, zone, bin}
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}'::jsonb,

    UNIQUE(product_id, location_id, batch_number)
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_batch ON inventory(batch_number);
CREATE INDEX idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX idx_inventory_available ON inventory(available_qty);

-- Partial index for low stock alerts
CREATE INDEX idx_inventory_low_stock ON inventory(product_id, location_id)
WHERE available_qty < 10;

-- Partial index for expiry alerts (expiring in 30 days)
CREATE INDEX idx_inventory_expiring_soon ON inventory(product_id, location_id)
WHERE expiry_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days');
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | Product reference |
| location_id | UUID | Location reference |
| batch_number | VARCHAR(100) | Batch/lot number |
| expiry_date | DATE | Expiry date |
| quantity | INTEGER | Total quantity |
| reserved_qty | INTEGER | Reserved quantity |
| available_qty | INTEGER | Computed: quantity - reserved |
| cost_price | DECIMAL | Unit cost |
| location_details | JSONB | Specific location info |

---

### 3.6 Transactions

Record of all inventory movements (immutable).

```sql
CREATE TABLE transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id      VARCHAR(50) UNIQUE NOT NULL,
    type                transaction_type NOT NULL,
    status              transaction_status NOT NULL DEFAULT 'pending',

    -- Product & Location
    product_id          UUID NOT NULL REFERENCES products(id),
    from_location_id    UUID REFERENCES locations(id) ON DELETE SET NULL,
    to_location_id      UUID REFERENCES locations(id) ON DELETE SET NULL,

    -- Quantities
    quantity            INTEGER NOT NULL,
    batch_number        VARCHAR(100),
    expiry_date         DATE,

    -- References
    reference_number    VARCHAR(100), -- External reference (PO, DO, etc.)
    parent_transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

    -- Reason & Notes
    reason              VARCHAR(255),
    notes               TEXT,

    -- Timestamps
    scheduled_for       TIMESTAMP,
    completed_at        TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by          UUID NOT NULL REFERENCES users(id),

    metadata            JSONB DEFAULT '{}'::jsonb
);

CREATE TYPE transaction_type AS ENUM (
    'transfer',      -- Between locations
    'sale',          -- Sold to customer
    'return',        -- Returned from customer
    'adjustment',    -- Manual correction
    'production',    -- Manufactured
    'receipt',       -- Received from supplier
    'damage',        -- Damaged/lost
    'expiry'         -- Expired
);

CREATE TYPE transaction_status AS ENUM (
    'pending',
    'confirmed',
    'picked_up',
    'in_transit',
    'delivered',
    'cancelled',
    'failed'
);

CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_from_location ON transactions(from_location_id);
CREATE INDEX idx_transactions_to_location ON transactions(to_location_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference_number);
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| transaction_id | VARCHAR(50) | Human-readable transaction ID |
| type | ENUM | Transaction type |
| status | ENUM | Current status |
| product_id | UUID | Product being moved |
| from_location_id | UUID | Source location |
| to_location_id | UUID | Destination location |
| quantity | INTEGER | Quantity moved |
| batch_number | VARCHAR(100) | Batch reference |
| reason | VARCHAR(255) | Reason for transaction |
| reference_number | VARCHAR(100) | External reference |
| scheduled_for | TIMESTAMP | When to execute |

---

### 3.7 Transaction Events

Event log for tracking transaction progress (append-only).

```sql
CREATE TABLE transaction_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id      UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    event_type          VARCHAR(50) NOT NULL,
    event_status        VARCHAR(50) NOT NULL,

    -- Location info
    location_id         UUID REFERENCES locations(id) ON DELETE SET NULL,
    location_name       VARCHAR(255), -- Denormalized for history

    -- GPS tracking
    geo_lat             DECIMAL(10, 8),
    geo_lng             DECIMAL(11, 8),
    geo_accuracy        DECIMAL(10, 2), -- in meters

    -- Environmental data (for cold chain)
    temperature         DECIMAL(5, 2),
    humidity            DECIMAL(5, 2),

    -- Additional info
    notes               TEXT,
    attachments         VARCHAR(500)[], -- Photos, documents
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by          UUID REFERENCES users(id),

    metadata            JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_tx_events_transaction ON transaction_events(transaction_id);
CREATE INDEX idx_tx_events_type ON transaction_events(event_type);
CREATE INDEX idx_tx_events_created_at ON transaction_events(created_at DESC);

-- For Geo queries
CREATE INDEX idx_tx_events_location ON transaction_events USING GIST(
    point(geo_lng, geo_lat)
) WHERE geo_lat IS NOT NULL AND geo_lng IS NOT NULL;
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| transaction_id | UUID | Parent transaction |
| event_type | VARCHAR(50) | Type of event |
| event_status | VARCHAR(50) | Status after event |
| location_id | UUID | Where event occurred |
| geo_lat/lng | DECIMAL | GPS coordinates |
| temperature | DECIMAL | Temperature reading |
| humidity | DECIMAL | Humidity reading |
| notes | TEXT | Event notes |
| attachments | ARRAY | URLs to attached files |

---

### 3.8 Alerts

System-generated alerts for various conditions.

```sql
CREATE TABLE alerts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type          alert_type NOT NULL,
    severity            alert_severity NOT NULL DEFAULT 'info',
    title               VARCHAR(255) NOT NULL,
    message             TEXT NOT NULL,

    -- References
    product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
    location_id         UUID REFERENCES locations(id) ON DELETE SET NULL,
    transaction_id      UUID REFERENCES transactions(id) ON DELETE SET NULL,
    inventory_id        UUID REFERENCES inventory(id) ON DELETE SET NULL,

    -- Status
    status              alert_status NOT NULL DEFAULT 'active',
    acknowledged_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at     TIMESTAMP,
    resolved_at         TIMESTAMP,

    -- Notification
    notified_users      UUID[] DEFAULT ARRAY[]::UUID[],
    notification_sent   BOOLEAN NOT NULL DEFAULT false,

    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    metadata            JSONB DEFAULT '{}'::jsonb
);

CREATE TYPE alert_type AS ENUM (
    'low_stock',
    'expiry_warning',
    'expired',
    'shipment_delay',
    'temperature_alert',
    'system_error'
);

CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'dismissed');

CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_location ON alerts(location_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
```

---

### 3.9 Audit Logs

Complete audit trail of all system changes.

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID NOT NULL,
    action          VARCHAR(50) NOT NULL, -- create, update, delete
    old_values      JSONB,
    new_values      JSONB,
    changed_fields  TEXT[],
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- Partition by month for better performance
-- CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
-- FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## 4. Views

### 4.1 Current Inventory View

```sql
CREATE VIEW v_current_inventory AS
SELECT
    l.id AS location_id,
    l.name AS location_name,
    l.type AS location_type,
    p.id AS product_id,
    p.sku,
    p.name AS product_name,
    c.name AS category_name,
    COALESCE(SUM(i.available_qty), 0) AS total_available,
    COALESCE(SUM(i.quantity), 0) AS total_quantity,
    COALESCE(SUM(i.reserved_qty), 0) AS total_reserved,
    COUNT(DISTINCT i.batch_number) AS batch_count
FROM locations l
CROSS JOIN products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN inventory i ON i.product_id = p.id AND i.location_id = l.id
WHERE l.is_active = true AND p.is_active = true
GROUP BY l.id, l.name, l.type, p.id, p.sku, p.name, c.name;
```

### 4.2 Product Trace View

```sql
CREATE VIEW v_product_trace AS
SELECT
    t.transaction_id,
    t.type,
    t.status,
    t.created_at,
    p.sku,
    p.name AS product_name,
    from_loc.name AS from_location,
    to_loc.name AS to_location,
    t.quantity,
    t.batch_number,
    u.name AS created_by_name
FROM transactions t
JOIN products p ON t.product_id = p.id
LEFT JOIN locations from_loc ON t.from_location_id = from_loc.id
LEFT JOIN locations to_loc ON t.to_location_id = to_loc.id
JOIN users u ON t.created_by = u.id;
```

### 4.3 Low Stock Alert View

```sql
CREATE VIEW v_low_stock AS
SELECT
    l.id AS location_id,
    l.name AS location_name,
    p.id AS product_id,
    p.sku,
    p.name AS product_name,
    p.min_stock_level,
    COALESCE(SUM(i.available_qty), 0) AS current_stock,
    p.min_stock_level - COALESCE(SUM(i.available_qty), 0) AS deficit
FROM locations l
CROSS JOIN products p
LEFT JOIN inventory i ON i.product_id = p.id AND i.location_id = l.id
WHERE l.is_active = true AND p.is_active = true
GROUP BY l.id, l.name, p.id, p.sku, p.name, p.min_stock_level
HAVING COALESCE(SUM(i.available_qty), 0) < p.min_stock_level;
```

---

## 5. Database Functions & Triggers

### 5.1 Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### 5.2 Transaction ID Generator

```sql
CREATE OR REPLACE FUNCTION generate_transaction_id()
RETURNS TRIGGER AS $$
DECLARE
    tx_prefix TEXT;
    tx_sequence INTEGER;
BEGIN
    -- Generate prefix based on transaction type
    CASE
        WHEN NEW.type = 'transfer' THEN tx_prefix := 'TXF';
        WHEN NEW.type = 'sale' THEN tx_prefix := 'TXS';
        WHEN NEW.type = 'return' THEN tx_prefix := 'TXR';
        WHEN NEW.type = 'adjustment' THEN tx_prefix := 'TXA';
        WHEN NEW.type = 'receipt' THEN tx_prefix := 'TXR';
        WHEN NEW.type = 'production' THEN tx_prefix := 'TXP';
        ELSE tx_prefix := 'TXN';
    END CASE;

    -- Get sequence number for today
    SELECT COALESCE(MAX(CAST(substring(transaction_id FROM 7 FOR 6) AS INTEGER)), 0) + 1
    INTO tx_sequence
    FROM transactions
    WHERE transaction_id LIKE tx_prefix || '%' || date_format(NOW(), 'YYYYMMDD');

    -- Generate transaction ID: PREFIX + YYYYMMDD + 6-digit sequence
    NEW.transaction_id := tx_prefix || TO_CHAR(NOW(), 'YYYYMMDD') ||
                           LPAD(tx_sequence::TEXT, 6, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_transaction_id_trigger
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION generate_transaction_id();
```

---

## 6. Performance Considerations

### 6.1 Indexing Strategy

| Query Pattern | Index Used |
|---------------|------------|
| Find by SKU | B-tree on products.sku |
| Product search | Full-text search on products |
| Inventory lookup | Composite index on (product_id, location_id) |
| Transaction history | B-tree on created_at DESC |
| Low stock alert | Partial index where available_qty < threshold |
| Expiring products | Partial index on expiry_date |
| Geo queries | GiST index on (geo_lng, geo_lat) |

### 6.2 Partitioning (For Scale)

```sql
-- Partition transactions by year
CREATE TABLE transactions_2024 PARTITION OF transactions
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE transactions_2025 PARTITION OF transactions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 6.3 Connection Pooling

- Use PgBouncer or built-in pool
- Recommended pool size: `(cores * 2) + effective_spindle_count`
- Default recommendation: 20-50 connections

---

## 7. Backup & Recovery

### 7.1 Backup Strategy

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Full Backup | Daily | 30 days |
| Incremental | Hourly | 7 days |
| WAL Archive | Continuous | 30 days |

### 7.2 Recovery

- Point-in-time recovery (PITR) capability
- RTO: 1 hour
- RPO: 5 minutes
