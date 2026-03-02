# Tech Stack Specification

## Overview

Supply Chain & Tracking System menggunakan teknologi modern yang diadopsi industri tahun 2025.

---

## Tech Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 15 | React Framework, App Router, SSR |
| | React | 19 | UI Library |
| | TypeScript | 5 | Type Safety |
| | shadcn/ui | latest | Component Library (Radix-based) |
| | Tailwind CSS | 4 | Styling |
| | Lucide React | latest | Icons |
| | TanStack Query | v5 | Server State, Caching, Mutations |
| | React Hook Form | latest | Form Management |
| | Zod | latest | Schema Validation |
| | Recharts | latest | Charts Visualization |
| | TanStack Table | v8 | Data Tables |
| **Backend** | NestJS | 10+ | API Framework (TypeScript-first) |
| | TypeScript | 5 | Type Safety |
| | Prisma | 5+ | ORM |
| | @nestjs/passport | latest | Authentication Wrapper |
| | @nestjs/jwt | latest | JWT Strategy |
| | @nestjs/bull | latest | Job Queue (Background Jobs) |
| | @nestjs/schedule | latest | Scheduled Tasks (Cron Jobs) |
| | class-validator | latest | DTO Validation |
| | class-transformer | latest | Data Transformation |
| | bcrypt | latest | Password Hashing |
| **Database** | PostgreSQL | 16+ | Primary Database |
| | Redis | 7+ | Cache, Sessions, Rate Limiting |
| **DevOps** | Docker | latest | Containerization |
| | Docker Compose | latest | Local Development |
| | PM2 | latest | Process Manager (Production) |
| | Nginx | latest | Reverse Proxy (Production) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  Next.js 15 + React + shadcn/ui + Tailwind + TanStack Query │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│                      NestJS + Swagger                        │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │   Auth      │     │   Business  │     │  Background │
  │   Service   │     │   Services  │     │    Jobs     │
  └─────────────┘     └─────────────┘     └─────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         ▼                    ▼                    ▼
  ┌─────────────┐     ┌─────────────┐
  │ PostgreSQL  │     │    Redis    │
  │  (Primary)  │     │   (Cache)   │
  └─────────────┘     └─────────────┘
```

---

## Frontend Stack

### Core Framework

| Technology | Description |
|------------|-------------|
| **Next.js 15** | React framework with App Router, Server Components, SSR/SSG |
| **React 19** | UI library with latest features |
| **TypeScript 5** | End-to-end type safety |

### UI & Styling

| Technology | Description |
|------------|-------------|
| **shadcn/ui** | Copy-paste components, fully customizable, Radix primitives |
| **Tailwind CSS 4** | Utility-first CSS, zero-runtime |
| **Lucide React** | Consistent icon set |

### State & Data

| Technology | Description |
|------------|-------------|
| **TanStack Query (v5)** | Server state, caching, optimistic updates, refetching |
| **Zustand** (optional) | Client state for simple global state |

### Forms & Validation

| Technology | Description |
|------------|-------------|
| **React Hook Form** | Performant form handling |
| **Zod** | Schema validation, type-safe |

### Visualization

| Technology | Description |
|------------|-------------|
| **Recharts** | Charts (Line, Bar, Pie, Donut) |
| **TanStack Table (v8)** | Headless UI for data tables |

---

## Backend Stack

### Core Framework

| Technology | Description |
|------------|-------------|
| **NestJS 10+** | Progressive Node.js framework, TypeScript-first, modular |
| **TypeScript 5** | Type safety across codebase |

### Database & ORM

| Technology | Description |
|------------|-------------|
| **Prisma 5+** | Type-safe ORM, schema-based, migrations, client generation |

### Authentication

| Technology | Description |
|------------|-------------|
| **@nestjs/passport** | Authentication middleware |
| **@nestjs/jwt** | JWT token strategy |
| **bcrypt** | Password hashing (10 rounds) |

### Background Jobs

| Technology | Description |
|------------|-------------|
| **@nestjs/bull** | Redis-based job queue for background tasks |
| | Report generation, Alert processing, Email notifications |

### Scheduled Tasks

| Technology | Description |
|------------|-------------|
| **@nestjs/schedule** | Cron jobs for periodic tasks |
| | Low stock checks, Expiry alerts, Cleanup tasks |

### Validation

| Technology | Description |
|------------|-------------|
| **class-validator** | Decorator-based validation for DTOs |
| **class-transformer** | Transform plain objects to class instances |

---

## Database Stack

### PostgreSQL 16+

| Feature | Usage |
|---------|-------|
| Primary Database | All persistent data |
| JSONB | Flexible fields for metadata |
| Indexes | Optimized queries |
| Foreign Keys | Data integrity |
| Transactions | ACID compliance |

### Redis 7+

| Feature | Usage |
|---------|-------|
| Cache | Query result caching |
| Sessions | User session storage |
| Rate Limiting | API rate limiting |
| Bull Queue | Job queue backend |

---

## Project Structure

```
supply-chain-tracking/
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── (auth)/           # Auth group
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (dashboard)/     # Dashboard group
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── inventory/
│   │   │   │   │   ├── shipments/
│   │   │   │   │   ├── users/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   └── event-logs/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/          # UI Components
│   │   │   │   ├── ui/              # shadcn components
│   │   │   │   ├── layout/          # Layout components
│   │   │   │   ├── dashboard/       # Dashboard components
│   │   │   │   ├── products/        # Product components
│   │   │   │   ├── inventory/       # Inventory components
│   │   │   │   ├── shipments/       # Shipment components
│   │   │   │   ├── users/           # User components
│   │   │   │   ├── analytics/       # Analytics components
│   │   │   │   └── shared/          # Shared components
│   │   │   ├── lib/                 # Utilities
│   │   │   │   ├── api.ts           # API client
│   │   │   │   ├── auth.ts          # Auth utilities
│   │   │   │   ├── query.ts         # TanStack Query setup
│   │   │   │   └── utils.ts
│   │   │   └── styles/              # Additional styles
│   │   ├── public/                  # Static assets
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                          # NestJS Backend
│       ├── src/
│       │   ├── modules/              # Feature modules
│       │   │   ├── auth/             # Authentication module
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── dto/
│       │   │   │   ├── strategies/
│       │   │   │   └── guards/
│       │   │   ├── users/            # Users module
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   ├── users.module.ts
│       │   │   │   └── dto/
│       │   │   ├── products/         # Products module
│       │   │   │   ├── products.controller.ts
│       │   │   │   ├── products.service.ts
│       │   │   │   ├── products.module.ts
│       │   │   │   └── dto/
│       │   │   ├── inventory/        # Inventory module
│       │   │   │   ├── inventory.controller.ts
│       │   │   │   ├── inventory.service.ts
│       │   │   │   ├── inventory.module.ts
│       │   │   │   └── dto/
│       │   │   ├── shipments/        # Shipments module
│       │   │   │   ├── shipments.controller.ts
│       │   │   │   ├── shipments.service.ts
│       │   │   │   ├── shipments.module.ts
│       │   │   │   └── dto/
│       │   │   ├── analytics/        # Analytics module
│       │   │   │   ├── analytics.controller.ts
│       │   │   │   ├── analytics.service.ts
│       │   │   │   ├── analytics.module.ts
│       │   │   │   └── dto/
│       │   │   └── events/           # Events module
│       │   │       ├── events.controller.ts
│       │   │       ├── events.service.ts
│       │   │       ├── events.module.ts
│       │   │       └── dto/
│       │   ├── common/               # Shared resources
│       │   │   ├── decorators/       # Custom decorators
│       │   │   ├── dto/              # Base DTOs
│       │   │   ├── filters/          # Exception filters
│       │   │   ├── guards/           # Auth guards
│       │   │   ├── interceptors/     # Interceptors
│       │   │   ├── middlewares/      # Middlewares
│       │   │   ├── pipes/            # Custom pipes
│       │   │   └── helpers/          # Helper functions
│       │   ├── config/               # Configuration
│       │   │   ├── database.config.ts
│       │   │   ├── jwt.config.ts
│       │   │   └── redis.config.ts
│       │   ├── database/             # Prisma client
│       │   │   └── prisma.service.ts
│       │   ├── jobs/                 # Bull jobs
│       │   │   ├── report.job.ts
│       │   │   ├── alert.job.ts
│       │   │   └── email.job.ts
│       │   ├── main.ts               # Entry point
│       │   └── app.module.ts         # Root module
│       ├── prisma/                   # Prisma files
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── test/                     # Tests
│       ├── package.json
│       ├── nest-cli.json
│       └── tsconfig.json
│
├── packages/                         # Shared packages
│   ├── shared/                       # Shared types & utilities
│   │   ├── src/
│   │   │   ├── types/                # TypeScript types
│   │   │   ├── utils/                # Shared utilities
│   │   │   └── constants/            # Constants
│   │   └── package.json
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   └── components/
│   │   └── package.json
│   └── db/                           # Shared Prisma schema
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── docker-compose.yml
├── Dockerfile
├── turbo.json                        # Turborepo config
├── package.json                      # Root package.json
├── pnpm-workspace.yaml               # PNPM workspace
└── .gitignore
```

---

## Prisma Setup

### Installation

```bash
# Install Prisma CLI and Client
npm install prisma @prisma/client -D

# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql
```

### Schema Configuration

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain?schema=public"
```

### Commands

```bash
# Generate migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database (dev only)
npx prisma migrate reset
```

---

## Authentication Flow

### JWT Strategy

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Login (email/password)
     ▼
┌──────────────┐
│   Next.js    │
│   Frontend   │
└──────┬───────┘
     │ 2. POST /api/auth/login
     ▼
┌──────────────┐
│    NestJS    │
│  ┌─────────┐ │ 3. Validate credentials
│  │ Auth    │ │─────────────────┐
│  │Service  │ │                 ▼
│  └────┬────┘ │         ┌──────────────┐
│       │      │         │  PostgreSQL  │
│  ┌────┴────┐ │         │   Verify     │
│  │   JWT   │ │         │   Password   │
│  │  Sign   │ │         └──────────────┘
│  └────┬────┘ │                 │
└───────┼──────┘                 │
        │ 4. Return Token        │
        └────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│  Store JWT in:                   │
│  - HttpOnly Cookie (secure)      │
│  - localStorage (fallback)       │
└──────────────────────────────────┘
```

### JWT Configuration

```typescript
// jwt.config.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
```

---

## Background Jobs (Bull)

### Job Queue Configuration

```typescript
// app.module.ts
BullModule.registerQueue({
  name: 'reports',
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
```

### Job Examples

| Job | Trigger | Action |
|-----|---------|--------|
| Report Generation | User request | Generate PDF/Excel/CSV |
| Alert Processing | Cron (every 15 min) | Check low stock, expiry |
| Email Notification | Event trigger | Send alert emails |

---

## Scheduled Tasks (Cron)

```typescript
// @Cron('*/15 * * * *') - Every 15 minutes
@Cron('0 0 * * *') - Every midnight
@Cron('0 9 * * 1') - Every Monday 9 AM
```

| Schedule | Task |
|----------|------|
| */15 * * * * | Check low stock & expiry |
| 0 0 * * * | Daily inventory summary |
| 0 9 * * 1 | Weekly report generation |

---

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: supply_chain_db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: supply_chain
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: supply_chain_redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  api:
    build: ./apps/api
    container_name: supply_chain_api
    ports:
      - '3001:3001'
    environment:
      DATABASE_URL: postgresql://admin:secret@postgres:5432/supply_chain
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
      - redis

  web:
    build: ./apps/web
    container_name: supply_chain_web
    ports:
      - '3000:3000'
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

---

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://admin:secret@localhost:5432/supply_chain?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# App
API_PORT=3001
NODE_ENV=development

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
```

---

## Industry Standards Applied

| Aspect | Standard |
|--------|----------|
| **Architecture** | Layered + Modular (NestJS modules) |
| **API Design** | REST |
| **Auth** | JWT + HttpOnly Cookie |
| **Validation** | Zod (FE) + class-validator (BE) |
| **Error Handling** | Global exception filter |
| **Logging** | Winston + Structured logs |
| **Testing** | Jest + E2E with Playwright |
| **Code Style** | ESLint + Prettier |
| **Git Flow** | Feature branch + PR review |
| **CI/CD** | GitHub Actions |
| **Container** | Docker + Docker Compose |
| **Type Safety** | TypeScript (End-to-end) |
| **State Management** | Server state (TanStack Query) |
| **Monorepo** | Turborepo + PNPM workspace |

---

## Package Managers

| Tool | Purpose |
|------|---------|
| **PNPM** | Monorepo package manager (fast, disk-efficient) |
| **Turbo** | Build system for monorepo |

---

## Production Considerations

| Aspect | Solution |
|--------|----------|
| **Reverse Proxy** | Nginx |
| **Process Manager** | PM2 |
| **SSL/HTTPS** | Let's Encrypt (Certbot) |
| **Monitoring** | Sentry (errors), Prometheus (metrics) |
| **Logging** | Winston + ELK Stack |
| **Backup** | pg_dump (PostgreSQL backup) |
| **CDN** | Cloudflare (optional) |
