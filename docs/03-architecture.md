# System Architecture

## 1. Architectural Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  Web Dashboard  │  │  Mobile Web     │  │  Admin Panel    │         │
│  │  (Next.js)      │  │  (Responsive)   │  │  (Same Stack)   │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
└───────────┼────────────────────┼────────────────────┼──────────────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
┌────────────────────────────────┼───────────────────────────────────────┐
│                              API GATEWAY                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  • Request Routing  • Rate Limiting  • CORS  • Authentication   │   │
│  │  • Request Logging  • Error Handling  • Response Formatting    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
┌───────────▼──────────┐ ┌──────▼───────┐ ┌─────────▼─────────┐
│   PRODUCT SERVICE    │ │  TRACKING    │ │  ANALYTICS        │
│                      │ │  SERVICE     │ │  SERVICE          │
│  • Product CRUD      │ │              │ │                   │
│  • Category Mgmt     │ │ • Shipment   │ │  • Reports        │
│  • Batch Tracking    │ │   Tracking   │ │  • Dashboards     │
│  • Expiry Mgmt       │ │ • Events     │ │  • Metrics        │
│                      │ │ • Status     │ │                   │
└──────────┬──────────┘ └──────┬───────┘ └─────────┬─────────┘
           │                   │                     │
           └───────────────────┼─────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ PostgreSQL  │  │   Redis     │  │   Kafka     │  │   S3/Files  ││
│  │  (Primary)  │  │  (Cache)    │  │  (Events)   │  │  (Assets)   ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└───────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Description

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| **Web Dashboard** | User interface for all operations | Next.js, React |
| **API Gateway** | Entry point, cross-cutting concerns | NestJS, Express |
| **Product Service** | Product and inventory management | NestJS |
| **Tracking Service** | Shipment and tracking operations | NestJS |
| **Analytics Service** | Reports and dashboards | NestJS |
| **PostgreSQL** | Primary data storage | PostgreSQL 16 |
| **Redis** | Caching and sessions | Redis 7 |
| **Kafka** | Event streaming (optional) | Kafka |

---

## 2. Architectural Patterns

### 2.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (UI Components, Pages, User Interaction)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    API LAYER (GATEWAY)                      │
│  (REST Controllers, Request Validation, Auth)               │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                      │
│  (Services, Domain Logic, Rules, Validation)                │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│  (Repositories, Database Queries, External APIs)            │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   DATA STORAGE LAYER                        │
│  (Database, Cache, File Storage)                            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Event Sourcing for Transactions

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Command    │────▶│   Event      │────▶│   Read       │
│  (Create     │     │  Store       │     │  Model       │
│  Shipment)   │     │  (Append     │     │  (Current    │
│              │     │   Only)      │     │   State)     │
└──────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Event      │
                    │   Stream     │
                    │  (Kafka)     │
                    └──────────────┘
```

**Benefits:**
- Complete audit trail
- Temporal queries (state at any point in time)
- Event replay for debugging
- Natural fit for supply chain tracking

### 2.3 CQRS (Command Query Responsibility Segregation)

```
┌─────────────────────────────────────────────────────────────────┐
│                           COMMAND SIDE                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐ │
│  │ Create  │ -> │ Validate│ -> │ Execute │ -> │ Save Event  │ │
│  │Shipment│    │         │    │         │    │ (Write DB)   │ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Event Propagation)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                            QUERY SIDE                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐ │
│  │ Get     │ <- │  Cache  │ <- │  Read   │ <- │ Materialized │ │
│  │Shipment│    │ (Redis) │    │  Model  │    │   View       │ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Service Decomposition

### 3.1 Product Service

```
Product Service
├── Product Module
│   ├── Create Product
│   ├── Update Product
│   ├── Delete Product
│   ├── Get Product
│   └── List Products
├── Category Module
│   ├── Create Category
│   ├── Update Category
│   └── Get Category Tree
└── Batch Module
    ├── Assign Batch
    └── Update Expiry
```

**Responsibilities:**
- Product catalog management
- Category hierarchy
- Batch and expiry tracking

### 3.2 Inventory Service

```
Inventory Service
├── Stock Module
│   ├── Get Stock Level
│   ├── Adjust Stock
│   ├── Transfer Stock
│   └── Reserve Stock
├── Alert Module
│   ├── Low Stock Check
│   └── Expiry Alert Check
└── Snapshot Module
    └── Daily Stock Snapshot
```

**Responsibilities:**
- Real-time inventory tracking
- Stock adjustments and transfers
- Alerts and notifications

### 3.3 Tracking Service

```
Tracking Service
├── Shipment Module
│   ├── Create Shipment
│   ├── Update Shipment Status
│   ├── Get Shipment Details
│   └── List Shipments
├── Event Module
│   ├── Add Tracking Event
│   ├── Get Event History
│   └── Get Current Status
└── Route Module
    └── Get Tracking History
```

**Responsibilities:**
- Shipment lifecycle management
- Tracking event logging
- Status transitions

### 3.4 Analytics Service

```
Analytics Service
├── Report Module
│   ├── Inventory Report
│   ├── Shipment Report
│   └── Transaction Report
├── Dashboard Module
│   ├── Key Metrics
│   └── Charts
└── Export Module
    └── Export to CSV/PDF
```

**Responsibilities:**
- Report generation
- Dashboard data aggregation
- Data export

---

## 4. Data Flow

### 4.1 Create Shipment Flow

```
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│  User  │──▶│ Front  │──▶│  API   │──▶│Service │──▶│Database│
│        │   │  End   │   │Gateway │   │        │   │        │
└────────┘   └────────┘   └────────┘   └────────┘   └────────┘
                                                           │
                                                           ▼
                                                    ┌────────────┐
                                                    │Create Event│
                                                    └────────────┘
                                                           │
                                                           ▼
                                                    ┌────────────┐
                                                    │Update Stock│
                                                    │ (Reserve)  │
                                                    └────────────┘
                                                           │
                                                           ▼
                                                    ┌────────────┐
                                                    │Publish     │
                                                    │Notification│
                                                    └────────────┘
```

### 4.2 Real-time Tracking Update Flow

```
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│ Driver │──▶│ Mobile │──▶│  API   │──▶│Service │──▶│Database│
│ Device │   │  App   │   │Gateway │   │        │   │        │
└────────┘   └────────┘   └────────┘   └────────┘   └────────┘
                                              │
                                              ▼
                                       ┌────────────┐
                                       │WebSocket   │
                                       │Broadcast   │
                                       └────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              ┌───────────┐             ┌───────────┐             ┌───────────┐
              │Dashboard  │             │Mobile App │             │Alert      │
              │Updates    │             │Updates    │             │Service    │
              └───────────┘             └───────────┘             └───────────┘
```

---

## 5. Technology Stack Details

### 5.1 Frontend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND ARCHITECTURE                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Next.js 15                        │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         React Components (Client)             │  │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │   │
│  │  │  │ Products│  │Inventory│  │Tracking │       │  │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘       │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         Server Components (RSC)              │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         API Routes (/api/*)                   │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    State Management                │  │   │
│  │  (React Query, Zustand, or Context)                │  │   │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    UI Components                    │  │   │
│  │  (shadcn/ui + Tailwind CSS)                         │  │   │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Backend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND ARCHITECTURE                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    NestJS Framework                 │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         Controllers (Request Handling)         │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         Services (Business Logic)             │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │         Repositories (Data Access)            │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Modules                          │  │   │
│  │  Product | Inventory | Tracking | Analytics | Auth  │  │   │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    ORM (Prisma)                     │  │   │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE ARCHITECTURE                      │
│                                                              │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  PostgreSQL     │         │  PostgreSQL     │           │
│  │  (Primary)      │◀────────┤  (Replica)      │           │
│  │  ┌───────────┐  │ Stream  │  ┌───────────┐  │           │
│  │  │Products   │  │ Replication│Products   │  │           │
│  │  │Inventory  │  │         │  │Inventory  │  │           │
│  │  │Tx/Events  │  │         │  │Tx/Events  │  │           │
│  │  └───────────┘  │         │  └───────────┘  │           │
│  │                 │         │                 │           │
│  │  WRITE only     │         │  READ only      │           │
│  └─────────────────┘         └─────────────────┘           │
│                                                                  │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  Redis          │         │  TimescaleDB    │ (Optional)│
│  │  ┌───────────┐  │         │  (Time-series)  │           │
│  │  │Sessions   │  │         │  ┌───────────┐  │           │
│  │  │Cache      │  │         │  │Metrics    │  │           │
│  │  │Queue      │  │         │  │Logs       │  │           │
│  │  └───────────┘  │         │  └───────────┘  │           │
│  └─────────────────┘         └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Network Security                                 │   │
│  │     • HTTPS/TLS encryption                           │   │
│  │     • Firewall rules                                 │   │
│  │     • DDoS protection                                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  2. API Security                                      │   │
│  │     • Rate limiting                                  │   │
│  │     • Request validation                             │   │
│  │     • Input sanitization                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  3. Authentication & Authorization                   │   │
│  │     • JWT tokens                                     │   │
│  │     • RBAC (Role-Based Access Control)              │   │
│  │     • Password hashing (bcrypt)                      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  4. Data Security                                    │   │
│  │     • Encryption at rest (sensitive fields)          │   │
│  │     • SQL injection prevention                       │   │
│  │     • XSS protection                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  5. Audit & Logging                                  │   │
│  │     • Access logs                                    │   │
│  │     • Change audit trail                             │   │
│  │     • Security event logging                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production Environment                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Load Balancer                         │   │
│  │                    (Nginx/ALB)                           │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                   │
│  ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐          │
│  │   Web App   │   │   Web App   │   │   Web App   │          │
│  │  Instance 1 │   │  Instance 2 │   │  Instance 3 │          │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │                    API Cluster                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │   │
│  │  │ API Pod │  │ API Pod │  │ API Pod │  │ API Pod │     │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │   │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────┼────────────────────────────────┐   │
│  │                    Data Layer                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │ PostgreSQL  │  │   Redis     │  │   Object    │     │   │
│  │  │  Primary    │  │   Cluster   │  │   Storage   │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Metrics                           │   │
│  │  (Prometheus)                                       │   │
│  │  • Request rate, latency, errors                    │   │
│  │  • Resource usage (CPU, memory)                     │   │
│  │  • Business metrics (orders, shipments)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Visualization                     │   │
│  │  (Grafana)                                          │   │
│  │  • Dashboards                                       │   │
│  │  • Alerts                                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Logging                           │   │
│  │  (Loki / ELK)                                       │   │
│  │  • Application logs                                 │   │
│  │  • Access logs                                      │   │
│  │  • Error logs                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Tracing                           │   │
│  │  (Jaeger / Zipkin)                                   │   │
│  │  • Distributed tracing                              │   │
│  │  • Request flow across services                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
