# Supply Chain & Tracking System

A professional-grade supply chain tracking application for monitoring products, inventory, and shipments across multiple locations.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scalability](#scalability)
- [Contributing](#contributing)
- [License](#license)

## Overview

This system provides end-to-end visibility into supply chain operations, enabling businesses to track products from warehouses to end customers. Built with scalability and performance in mind.

### Key Capabilities

- Real-time tracking of products and shipments
- Multi-location inventory management
- Complete audit trail with event sourcing
- Analytics and reporting dashboard
- Temperature monitoring for cold chain
- Mobile-friendly scanning and updates

## Features

| Feature | Description |
|---------|-------------|
| **Product Management** | SKU management, categories, batch tracking, expiry dates |
| **Inventory Tracking** | Real-time stock levels across multiple locations |
| **Shipment Tracking** | Transfer products between locations with full traceability |
| **Event Logging** | Immutable audit trail for every transaction |
| **Cold Chain** | Temperature monitoring for perishable goods |
| **Analytics** | Reports on inventory turnover, shipment metrics, and more |
| **Real-time Updates** | WebSocket support for live tracking |
| **Mobile Support** | QR/barcode scanning for field operations |

## Tech Stack

### Frontend

```
Next.js 15      - React framework with App Router
TypeScript      - Type safety
shadcn/ui       - Modern UI components
TanStack Table  - Data tables with sorting/filtering
Mapbox          - Location visualization
Recharts        - Analytics charts
```

### Backend

```
Node.js         - Runtime
NestJS          - Progressive backend framework
TypeScript      - Type safety
Prisma ORM      - Database toolkit
Socket.io       - Real-time communication
Bull            - Job queue for async tasks
```

### Database & Infrastructure

```
PostgreSQL 16   - Primary database (ACID compliant)
Redis 7         - Caching and session storage
Kafka           - Event streaming (optional)
Docker          - Containerization
Kubernetes      - Orchestration (production)
```

### DevOps & Monitoring

```
Prometheus      - Metrics collection
Grafana         - Metrics visualization
Loki            - Log aggregation
GitHub Actions  - CI/CD
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Web Dashboard│  │  Mobile App  │  │  3rd Party   │          │
│  │   (Next.js)  │  │(React Native)│  │    API       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                               │
│                      (Kong / Nginx)                             │
│                    Rate Limiting • Auth                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Product Service│  │ Tracking Service│  │Analytics Service│
│     (NestJS)    │  │     (NestJS)    │  │     (NestJS)    │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │  Redis          │  │  Kafka          │
│  (Primary Data) │  │  (Cache/Queue)  │  │  (Event Stream) │
│  ┌───────────┐  │  └─────────────────┘  └─────────────────┘
│  │ Products  │  │
│  │ Inventory │  │
│  │Tx/Events  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │ Replicas  │  │
│  └───────────┘  │
└─────────────────┘
```

## Database Schema

### Core Tables

```sql
-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

-- Locations (Warehouses, Stores, Transit)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'warehouse', 'store', 'transit', 'supplier'
    address JSONB,
    geo_lat DECIMAL(10, 8),
    geo_lng DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Current Inventory State
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    location_id UUID REFERENCES locations(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    batch_number VARCHAR(100),
    expiry_date DATE,
    cost_price DECIMAL(10, 2),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, location_id, batch_number)
);

-- Transactions (Immutable - Audit Trail)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    from_location_id UUID REFERENCES locations(id),
    to_location_id UUID REFERENCES locations(id),
    quantity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'transfer', 'sale', 'return', 'adjustment', 'production'
    status VARCHAR(50) NOT NULL, -- 'pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'
    reference_number VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(100),
    completed_at TIMESTAMP
);

-- Transaction Events (Event Sourcing - Append Only)
CREATE TABLE transaction_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    event_type VARCHAR(100) NOT NULL, -- 'created', 'picked_up', 'in_transit', 'delivered', 'exception'
    location_id UUID REFERENCES locations(id),
    geo_lat DECIMAL(10, 8),
    geo_lng DECIMAL(11, 8),
    temperature DECIMAL(5, 2), -- for cold chain monitoring
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(100)
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'manager', 'operator', 'viewer'
    location_id UUID REFERENCES locations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);
CREATE INDEX idx_events_transaction ON transaction_events(transaction_id);
CREATE INDEX idx_events_created ON transaction_events(created_at DESC);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
```

### Entity Relationships

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Products   │────▶│ Categories  │     │  Locations  │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                      │
       │              ┌─────────────┐         │
       └─────────────▶│  Inventory  │◀────────┘
                      └──────┬──────┘
                             │
                             │
                      ┌──────▼──────┐
                      │Transactions │
                      └──────┬──────┘
                             │
                             │
                      ┌──────▼──────┐
                      │   Events    │
                      └─────────────┘
```

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create new product |
| `GET` | `/api/products` | List all products (paginated) |
| `GET` | `/api/products/:id` | Get product details |
| `PATCH` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/products/:id/trace` | Get full product history |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/inventory` | Get inventory across locations |
| `GET` | `/api/inventory/location/:id` | Get inventory by location |
| `GET` | `/api/inventory/product/:id` | Get product stock across locations |
| `POST` | `/api/inventory/adjust` | Manual inventory adjustment |

### Transactions / Shipments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transactions` | Create new transaction |
| `GET` | `/api/transactions` | List transactions |
| `GET` | `/api/transactions/:id` | Get transaction details |
| `PATCH` | `/api/transactions/:id/status` | Update transaction status |
| `POST` | `/api/transactions/:id/events` | Add tracking event |
| `GET` | `/api/transactions/:id/events` | Get transaction events |

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/locations` | List all locations |
| `POST` | `/api/locations` | Create new location |
| `GET` | `/api/locations/:id` | Get location details |
| `PATCH` | `/api/locations/:id` | Update location |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/inventory` | Inventory analytics |
| `GET` | `/api/analytics/shipments` | Shipment metrics |
| `GET` | `/api/analytics/performance` | Location performance |

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm
- PostgreSQL 16+
- Redis 7+
- Docker (optional, for containerized setup)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/supply-chain-tracking.git
cd supply-chain-tracking

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain"

# Redis
REDIS_URL="redis://localhost:6379"

# API
API_PORT=3000
API_HOST=localhost

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# External Services
MAPBOX_API_KEY=your-mapbox-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Kafka (optional)
KAFKA_BROKERS=localhost:9092
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend pnpm prisma migrate dev

# View logs
docker-compose logs -f
```

## Project Structure

```
supply-chain-tracking/
├── apps/
│   ├── backend/              # NestJS Backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── products/     # Product module
│   │   │   │   ├── inventory/    # Inventory module
│   │   │   │   ├── transactions/ # Transaction module
│   │   │   │   ├── locations/    # Location module
│   │   │   │   ├── analytics/    # Analytics module
│   │   │   │   └── auth/         # Authentication
│   │   │   ├── common/           # Shared utilities
│   │   │   ├── config/           # Configuration
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── prisma/
│   │
│   ├── frontend/             # Next.js Frontend
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── products/
│   │   │   │   ├── inventory/
│   │   │   │   ├── tracking/
│   │   │   │   └── analytics/
│   │   │   ├── auth/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   └── features/        # Feature components
│   │   ├── lib/
│   │   └── public/
│   │
│   └── mobile/               # React Native App (optional)
│
├── packages/
│   ├── shared/              # Shared types and utilities
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configuration
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── docs/
│   ├── api.md
│   ├── architecture.md
│   └── deployment.md
│
├── .env.example
├── docker-compose.yml
├── turbo.json              # Turborepo config
├── package.json
└── README.md
```

## Scalability

### Horizontal Scaling

| Component | Scaling Strategy |
|-----------|------------------|
| API Servers | Kubernetes HPA based on CPU/memory |
| Database | Read replicas for read-heavy workloads |
| Redis | Cluster mode for sharding |
| Kafka | Multiple brokers with partitioning |

### Performance Optimization

- **Database Indexing** on frequently queried columns
- **Redis Caching** for hot data (product info, inventory levels)
- **Connection Pooling** for database connections
- **CDN** for static assets
- **Lazy Loading** for large data sets
- **Pagination** on all list endpoints

### Monitoring

```
┌─────────────────┐     ┌─────────────────┐
│   Applications  │────▶│   Prometheus    │
│   (Metrics)     │     │   (Storage)     │
└─────────────────┘     └────────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │    Grafana     │
                         │ (Visualization)│
                         └────────────────┘
```

## Roadmap

- [x] Core CRUD operations
- [x] Event sourcing implementation
- [ ] Mobile app (barcode scanning)
- [ ] Advanced analytics dashboard
- [ ] Multi-tenancy support
- [ ] Cold chain monitoring alerts
- [ ] Integration with shipping carriers
- [ ] Mobile push notifications
- [ ] Offline mode support

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or join our Slack channel.
