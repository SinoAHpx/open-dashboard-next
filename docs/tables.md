# Table Infrastructure Guide

This guide explains how to create data tables using the project's infrastructure. Follow the step-by-step instructions to add a new table with real business logic.

## Quick Start

To add a new table (e.g., "orders"):
1. Create `src/features/orders/` with: `types.ts`, `repository.ts`, `columns.tsx`, `config.ts`, `index.ts`
2. Register handlers in your app's registry
3. Add resource entry for Refine routing
4. Create the page component

## Core Type Definitions

### ResourceHandlers<T> (src/infra/data/types.ts)

This is the interface your repository must implement:

```ts
import type { CrudFilters, CrudSorting } from "@refinedev/core";

interface ListParams {
  pagination?: { current?: number; pageSize?: number };
  filters?: CrudFilters;   // Array of { field, operator, value }
  sorters?: CrudSorting;   // Array of { field, order: "asc" | "desc" }
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

interface ResourceHandlers<T> {
  list?: (params: ListParams) => Promise<PaginatedResponse<T>>;
  getOne?: (id: string) => Promise<{ data: T }>;
  create?: (variables: Partial<T>) => Promise<{ data: T }>;
  update?: (id: string, variables: Partial<T>) => Promise<{ data: T }>;
  deleteOne?: (id: string) => Promise<{ data: { id: string } }>;
}
```

### TableConfig<T> (src/infra/table/types.ts)

Configuration passed to `PaginationTable`:

```ts
interface FilterOption { key: string; label: string; }

interface FilterConfig {
  key: string;           // Field name to filter on
  label: string;         // Dropdown label
  placeholder: string;   // e.g., "All statuses"
  options: FilterOption[];
}

interface TableConfig<T> {
  resource: string;              // Must match registered resource name
  columns: ColumnDef<T>[];       // TanStack Table column definitions
  filters?: FilterConfig[];      // Dropdown filters
  pageSizeOptions?: number[];    // e.g., [10, 25, 50]
  defaultPageSize?: number;      // Default: 10
  enableSearch?: boolean;        // Show search input
  searchPlaceholder?: string;    // e.g., "Search orders..."
  emptyMessage?: string;         // e.g., "No orders found"
  className?: string;
  getRowId?: (row: T) => string; // Default: row.id
}

interface TableMeta {
  title: string;
  description?: string;
}
```

### CrudFilters format (from Refine)

Filters are passed to your `list` handler as an array:

```ts
// Example filters array:
[
  { field: "status", operator: "eq", value: "pending" },
  { field: "q", operator: "contains", value: "search term" },
]
```

The `q` field is used for search input. Other fields correspond to your `FilterConfig.key` values.

## Architecture Overview

```
src/
├── infra/                    # Reusable infrastructure (DO NOT MODIFY)
│   ├── data/
│   │   ├── types.ts               # ListParams, PaginatedResponse, ResourceHandlers
│   │   └── filter-sort-paginate.ts# Helpers for in-memory filtering (optional)
│   ├── refine/
│   │   ├── resource-registry.ts   # registerResource(), getResourceHandlers()
│   │   └── data-provider.ts       # Delegates to registry
│   ├── table/
│   │   ├── types.ts               # TableConfig, TableMeta, FilterConfig
│   │   ├── PaginationTable.tsx    # Main table component
│   │   ├── TablePage.tsx          # Page layout wrapper
│   │   └── TableToolbar.tsx       # Search + filter controls
│   └── ui/
│       ├── StatusChip.tsx         # <StatusChip status="active" colorMap={...} />
│       └── ActionMenu.tsx         # <ActionMenu onEdit={} onDelete={} />
├── features/                 # YOUR BUSINESS LOGIC GOES HERE
│   └── orders/               # Example real feature
│       ├── types.ts
│       ├── repository.ts
│       ├── columns.tsx
│       ├── config.ts
│       └── index.ts
├── examples/                 # Demo modules (reference only)
│   ├── _utils/create-mock-repository.ts
│   ├── users/, products/, tasks/, selectables/
│   ├── _registry.ts
│   └── resources.ts
└── app/(dashboard)/
    └── orders/page.tsx       # Your page
```

## Step-by-Step: Adding a Real Table

### 1) Define types

```ts
// src/features/orders/types.ts
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}
export type OrderStatus = Order["status"];
```

### 2) Create repository (handlers)

Implement `ResourceHandlers<T>`. Choose ONE of the options below based on your data source.

**Option A: REST API**

```ts
// src/features/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { extractFilterMap } from "@/infra/data";
import type { Order } from "./types";

const API_BASE = "/api/orders";

export const ordersHandlers: ResourceHandlers<Order> = {
  list: async ({ pagination, filters, sorters }) => {
    // Extract filter values: { status: "pending", q: "search" }
    const filterMap = extractFilterMap(filters);
    
    const params = new URLSearchParams({
      page: String(pagination?.current ?? 1),
      pageSize: String(pagination?.pageSize ?? 10),
    });
    
    // Add filters to params
    if (filterMap.q) params.set("search", filterMap.q);
    if (filterMap.status) params.set("status", filterMap.status);
    
    // Add sorting
    if (sorters?.[0]) {
      params.set("sortBy", String(sorters[0].field));
      params.set("sortOrder", sorters[0].order);
    }
    
    const res = await fetch(`${API_BASE}?${params}`);
    if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
    const { data, total } = await res.json();
    return { data, total };
  },
  getOne: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Order ${id} not found`);
    return { data: await res.json() };
  },
  create: async (variables) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return { data: await res.json() };
  },
  update: async (id, variables) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    if (!res.ok) throw new Error(`Failed to update order ${id}`);
    return { data: await res.json() };
  },
  deleteOne: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete order ${id}`);
    return { data: { id } };
  },
};
```

**Option B: Prisma**

```ts
// src/features/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { extractFilterMap } from "@/infra/data";
import { prisma } from "@/server/db";
import type { Order } from "./types";

export const ordersHandlers: ResourceHandlers<Order> = {
  list: async ({ pagination, filters, sorters }) => {
    const filterMap = extractFilterMap(filters);
    const skip = ((pagination?.current ?? 1) - 1) * (pagination?.pageSize ?? 10);
    const take = pagination?.pageSize ?? 10;
    
    // Build where clause from filters
    const where: any = {};
    if (filterMap.status) where.status = filterMap.status;
    if (filterMap.q) {
      where.OR = [
        { customerName: { contains: filterMap.q, mode: "insensitive" } },
      ];
    }
    
    // Build orderBy from sorters
    const orderBy = sorters?.[0] 
      ? { [sorters[0].field as string]: sorters[0].order }
      : { createdAt: "desc" as const };
    
    const [data, total] = await prisma.$transaction([
      prisma.order.findMany({ where, skip, take, orderBy }),
      prisma.order.count({ where }),
    ]);
    return { data, total };
  },
  getOne: async (id) => {
    const order = await prisma.order.findUniqueOrThrow({ where: { id } });
    return { data: order };
  },
  create: async (variables) => {
    const order = await prisma.order.create({ data: variables as any });
    return { data: order };
  },
  update: async (id, variables) => {
    const order = await prisma.order.update({ where: { id }, data: variables });
    return { data: order };
  },
  deleteOne: async (id) => {
    await prisma.order.delete({ where: { id } });
    return { data: { id } };
  },
};
```

**Option C: Drizzle**

```ts
// src/features/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { extractFilterMap } from "@/infra/data";
import { db } from "@/server/db";
import { orders } from "@/server/db/schema";
import { eq, ilike, sql, desc, asc, and } from "drizzle-orm";
import type { Order } from "./types";

export const ordersHandlers: ResourceHandlers<Order> = {
  list: async ({ pagination, filters, sorters }) => {
    const filterMap = extractFilterMap(filters);
    const offset = ((pagination?.current ?? 1) - 1) * (pagination?.pageSize ?? 10);
    const limit = pagination?.pageSize ?? 10;
    
    // Build where conditions
    const conditions = [];
    if (filterMap.status) conditions.push(eq(orders.status, filterMap.status));
    if (filterMap.q) conditions.push(ilike(orders.customerName, `%${filterMap.q}%`));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build orderBy
    const orderBy = sorters?.[0]
      ? (sorters[0].order === "desc" ? desc : asc)(orders[sorters[0].field as keyof typeof orders] as any)
      : desc(orders.createdAt);
    
    const data = await db.select().from(orders).where(where).orderBy(orderBy).limit(limit).offset(offset);
    const [{ count: total }] = await db.select({ count: sql`count(*)` }).from(orders).where(where);
    return { data, total: Number(total) };
  },
  getOne: async (id) => {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) throw new Error(`Order ${id} not found`);
    return { data: order };
  },
  create: async (variables) => {
    const [order] = await db.insert(orders).values(variables as any).returning();
    return { data: order };
  },
  update: async (id, variables) => {
    const [order] = await db.update(orders).set(variables).where(eq(orders.id, id)).returning();
    return { data: order };
  },
  deleteOne: async (id) => {
    await db.delete(orders).where(eq(orders.id, id));
    return { data: { id } };
  },
};
```

**Option D: TypeORM**

```ts
// src/features/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { extractFilterMap } from "@/infra/data";
import { orderRepository } from "@/server/db/repositories";
import { ILike } from "typeorm";
import type { Order } from "./types";

export const ordersHandlers: ResourceHandlers<Order> = {
  list: async ({ pagination, filters, sorters }) => {
    const filterMap = extractFilterMap(filters);
    
    // Build where clause
    const where: any = {};
    if (filterMap.status) where.status = filterMap.status;
    if (filterMap.q) where.customerName = ILike(`%${filterMap.q}%`);
    
    // Build order
    const order = sorters?.[0]
      ? { [sorters[0].field as string]: sorters[0].order.toUpperCase() }
      : { createdAt: "DESC" };
    
    const [data, total] = await orderRepository.findAndCount({
      where,
      skip: ((pagination?.current ?? 1) - 1) * (pagination?.pageSize ?? 10),
      take: pagination?.pageSize ?? 10,
      order,
    });
    return { data, total };
  },
  getOne: async (id) => {
    const order = await orderRepository.findOneByOrFail({ id });
    return { data: order };
  },
  create: async (variables) => {
    const order = orderRepository.create(variables);
    await orderRepository.save(order);
    return { data: order };
  },
  update: async (id, variables) => {
    await orderRepository.update(id, variables);
    const order = await orderRepository.findOneByOrFail({ id });
    return { data: order };
  },
  deleteOne: async (id) => {
    await orderRepository.delete(id);
    return { data: { id } };
  },
};
```

**Option E: tRPC**

```ts
// src/features/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { extractFilterMap } from "@/infra/data";
import { trpc } from "@/utils/trpc";
import type { Order } from "./types";

export const ordersHandlers: ResourceHandlers<Order> = {
  list: async ({ pagination, filters, sorters }) => {
    const filterMap = extractFilterMap(filters);
    const { data, total } = await trpc.orders.list.query({
      page: pagination?.current ?? 1,
      pageSize: pagination?.pageSize ?? 10,
      search: filterMap.q,
      status: filterMap.status,
      sortBy: sorters?.[0]?.field as string,
      sortOrder: sorters?.[0]?.order,
    });
    return { data, total };
  },
  getOne: async (id) => {
    const order = await trpc.orders.getById.query({ id });
    return { data: order };
  },
  create: async (variables) => {
    const order = await trpc.orders.create.mutate(variables);
    return { data: order };
  },
  update: async (id, variables) => {
    const order = await trpc.orders.update.mutate({ id, ...variables });
    return { data: order };
  },
  deleteOne: async (id) => {
    await trpc.orders.delete.mutate({ id });
    return { data: { id } };
  },
};
```

**Option F: Mock data (for demos)**

```ts
// src/examples/orders/repository.ts
import type { ResourceHandlers } from "@/infra/data";
import { createMockRepository } from "@/examples/_utils/create-mock-repository";
import type { Order } from "./types";

export const ordersHandlers: ResourceHandlers<Order> = createMockRepository({
  storageKey: "example-orders",
  seedData: () => [
    { id: "1", customerName: "Ada", total: 120, status: "completed", createdAt: new Date().toISOString() },
  ],
  searchFields: ["customerName"],
  getId: (o) => o.id,
  generateId: () => String(Date.now()),
});
```

### 3) Define columns

```tsx
// src/features/orders/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { StatusChip, type ChipColor } from "@/infra/ui";
import type { Order, OrderStatus } from "./types";

const statusColorMap: Record<OrderStatus, ChipColor> = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
};

export const ordersColumns: ColumnDef<Order>[] = [
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <StatusChip status={info.getValue() as OrderStatus} colorMap={statusColorMap} />
    ),
  },
  { accessorKey: "total", header: "Total", cell: (info) => `$${(info.getValue() as number).toFixed(2)}` },
  { accessorKey: "createdAt", header: "Date" },
];
```

### 4) Create config and meta

```ts
// src/features/orders/config.ts
import type { TableConfig, TableMeta } from "@/infra/table";
import { ordersColumns } from "./columns";
import type { Order } from "./types";

export const ordersMeta: TableMeta = {
  title: "Orders",
  description: "Manage customer orders.",
};

export const ordersConfig: TableConfig<Order> = {
  resource: "orders",              // MUST match the name used in registerResource()
  columns: ordersColumns,
  filters: [
    { 
      key: "status",               // This becomes filters[].field in ListParams
      label: "Filter by status", 
      placeholder: "All statuses", 
      options: [
        { key: "pending", label: "Pending" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
      ]
    },
  ],
  enableSearch: true,              // Adds search input, passed as filters[].field="q"
  searchPlaceholder: "Search orders...",
  emptyMessage: "No orders found",
};
```

### 5) Export module

```ts
// src/features/orders/index.ts
export { ordersColumns } from "./columns";
export { ordersConfig, ordersMeta } from "./config";
export { ordersHandlers } from "./repository";
export * from "./types";
```

### 6) Register the resource

Create or update your feature registry:

```ts
// src/features/_registry.ts
import { registerResource } from "@/infra/refine";
import { ordersHandlers } from "./orders";

export function registerFeatureResources(): void {
  registerResource("orders", ordersHandlers);
  // register other features...
}
```

Call this in your providers:

```ts
// src/app/providers.tsx
import { registerFeatureResources } from "@/features/_registry";

registerFeatureResources(); // Call once before rendering
```

Add resource entry so Refine can route:

```ts
// src/features/resources.ts
import type { IResourceItem } from "@refinedev/core";

export const featureResources: IResourceItem[] = [
  { name: "orders", list: "/orders" },
  // other features
];
```

Pass to Refine:

```tsx
<Refine resources={featureResources} dataProvider={refineDataProvider} />
```

### 7) Create the page

```tsx
// src/app/(dashboard)/orders/page.tsx
"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useState } from "react";
import { ordersConfig, ordersMeta } from "@/features/orders";
import { PaginationTable, TablePage } from "@/infra/table";

export default function OrdersPage() {
  const [totalCount, setTotalCount] = useState(0);
  return (
    <TablePage title={ordersMeta.title} description={`${ordersMeta.description} Total: ${totalCount}`}>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><Spinner /></div>}>
        <PaginationTable {...ordersConfig} onTotalsChange={({ totalCount }) => setTotalCount(totalCount)} />
      </Suspense>
    </TablePage>
  );
}
```

## Advanced Features

### Selectable tables

Enable row selection:

```tsx
<PaginationTable
  {...ordersConfig}
  enableSelection
  onSelectionChange={({ ids, rows }) => {
    console.log("Selected IDs:", ids);
    console.log("Selected rows:", rows);
  }}
/>
```

### Row actions column

Add an actions column to your columns definition:

```tsx
// In columns.tsx
import { ActionMenu } from "@/infra/ui";

export const ordersColumns: ColumnDef<Order>[] = [
  // ... other columns
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { 
        onEdit?: (id: string) => void; 
        onDelete?: (id: string) => void;
      };
      return (
        <ActionMenu 
          onEdit={() => meta.onEdit?.(row.original.id)} 
          onDelete={() => meta.onDelete?.(row.original.id)} 
        />
      );
    },
  },
];
```

### Using table ref for imperative actions

```tsx
import { useRef } from "react";
import type { PaginationTableRef } from "@/infra/table";

const tableRef = useRef<PaginationTableRef>(null);

// After a mutation (create/update/delete):
tableRef.current?.refresh();

// Get selection:
const selectedIds = tableRef.current?.getSelectedKeys();
tableRef.current?.clearSelection();

<PaginationTable ref={tableRef} {...ordersConfig} />
```

### Permanent filters/sorters

Apply filters that users cannot change:

```tsx
<PaginationTable
  {...ordersConfig}
  permanentFilters={[{ field: "organizationId", operator: "eq", value: currentOrg.id }]}
  permanentSorters={[{ field: "createdAt", order: "desc" }]}
/>
```

## Using Refine's Built-in Data Providers

Instead of implementing `ResourceHandlers`, you can use Refine's data provider packages directly:

```ts
// src/app/providers.tsx
import dataProvider from "@refinedev/simple-rest";

<Refine
  dataProvider={dataProvider("https://api.example.com")}
  resources={[{ name: "orders", list: "/orders" }]}
/>
```

Available packages:
- `@refinedev/simple-rest` — REST APIs
- `@refinedev/nestjsx-crud` — NestJS CRUD
- `@refinedev/graphql` / `@refinedev/hasura` — GraphQL
- `@refinedev/supabase` — Supabase
- `@refinedev/appwrite` — Appwrite

See [Refine Data Provider docs](https://refine.dev/docs/data/data-provider/) for the full list.

## Checklist for Adding a New Table

- [ ] `src/features/{name}/types.ts` — Entity interface with `id: string`
- [ ] `src/features/{name}/repository.ts` — `ResourceHandlers<T>` implementation
- [ ] `src/features/{name}/columns.tsx` — `ColumnDef<T>[]` array
- [ ] `src/features/{name}/config.ts` — `TableConfig<T>` and `TableMeta`
- [ ] `src/features/{name}/index.ts` — Re-exports all above
- [ ] `src/features/_registry.ts` — Call `registerResource("{name}", handlers)`
- [ ] `src/features/resources.ts` — Add `{ name: "{name}", list: "/{name}" }`
- [ ] `src/app/(dashboard)/{name}/page.tsx` — Page component

## Helper Functions Reference

### extractFilterMap(filters)

Converts Refine's `CrudFilters` array to a simple key-value object:

```ts
import { extractFilterMap } from "@/infra/data";

// Input: [{ field: "status", operator: "eq", value: "pending" }, { field: "q", value: "search" }]
// Output: { status: "pending", q: "search" }
const filterMap = extractFilterMap(filters);
```

### filterSortPaginate(data, options)

For in-memory data (useful for mock repositories or client-side filtering):

```ts
import { filterSortPaginate } from "@/infra/data";

const result = filterSortPaginate(allData, {
  filters,
  sorters,
  pagination,
  searchFields: ["customerName", "email"], // Fields to search when q filter is present
});
// Returns: { data: T[], total: number }
```
