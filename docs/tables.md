# Table Infrastructure Guide

This project provides a modular table infrastructure built on Refine + TanStack Table. The codebase separates infrastructure (reusable primitives) from examples (demonstration tables).

## Architecture Overview

```
src/
├── infra/                    # Reusable infrastructure
│   ├── data/                 # Data layer utilities
│   │   ├── types.ts               # ListParams, PaginatedResponse, ResourceHandlers
│   │   ├── filter-sort-paginate.ts# Query helpers
│   │   └── create-mock-repository.ts # Factory for mock CRUD
│   ├── refine/               # Refine integration
│   │   ├── resource-registry.ts  # Central handler registry
│   │   ├── data-provider.ts      # Delegates to registry
│   │   └── auth-provider.ts
│   ├── table/                # Table components
│   │   ├── types.ts          # TableConfig, TableMeta, PaginationTableProps
│   │   ├── PaginationTable.tsx
│   │   ├── TablePage.tsx
│   │   ├── TableToolbar.tsx
│   │   └── TablePaginationControls.tsx
│   └── ui/                   # UI primitives
│       ├── StatusChip.tsx
│       └── ActionMenu.tsx
├── examples/                 # Demonstration modules
│   ├── users/
│   ├── products/
│   ├── tasks/
│   ├── selectables/
│   ├── simple/
│   ├── _registry.ts          # Registers all example handlers
│   └── resources.ts          # Refine resource definitions
└── app/(dashboard)/tables/   # Pages consume examples
```

## How it works

- Each example module exports: types, mock-data (optional), repository (handlers), columns, config, and meta via an `index.ts`.
- `createMockRepository()` returns CRUD handlers backed by localStorage for quick demos.
- `registerResource(name, handlers)` stores handlers in a central registry. The Refine data provider delegates all operations to the registered handlers.
- Pages import `TableConfig` and `TableMeta` from examples and render `PaginationTable` inside `TablePage`.

Providers are wired to call `registerExampleResources()` once and to pass `exampleResources` into Refine:

```ts
// src/app/providers.tsx
registerExampleResources();
<Refine resources={exampleResources} dataProvider={refineDataProvider} />
```

## Creating a new table

### 1) Define types

```ts
// src/examples/orders/types.ts
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

Use `createMockRepository` while prototyping. Replace with real API calls later.

```ts
// src/examples/orders/repository.ts
import { createMockRepository, type ResourceHandlers } from "@/infra/data";
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
// src/examples/orders/columns.tsx
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
// src/examples/orders/config.ts
import type { TableConfig, TableMeta } from "@/infra/table";
import { ordersColumns } from "./columns";
import type { Order } from "./types";

export const ordersMeta: TableMeta = {
  title: "Orders",
  description: "Manage customer orders.",
};

export const ordersConfig: TableConfig<Order> = {
  resource: "orders",
  columns: ordersColumns,
  filters: [
    { key: "status", label: "Filter by status", placeholder: "All statuses", options: [
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
      { key: "cancelled", label: "Cancelled" },
    ]},
  ],
  enableSearch: true,
  searchPlaceholder: "Search orders...",
  emptyMessage: "No orders found",
};
```

### 5) Export module

```ts
// src/examples/orders/index.ts
export { ordersColumns } from "./columns";
export { ordersConfig, ordersMeta } from "./config";
export { ordersHandlers } from "./repository";
export * from "./types";
```

### 6) Register the resource

```ts
// src/examples/_registry.ts
import { registerResource } from "@/infra/refine";
import { ordersHandlers } from "./orders";

export function registerExampleResources(): void {
  registerResource("orders", ordersHandlers);
  // register other resources...
}
```

Add an entry to `examples/resources.ts` so Refine can route to the list page:

```ts
// src/examples/resources.ts
import type { IResourceItem } from "@refinedev/core";
export const exampleResources: IResourceItem[] = [
  { name: "orders", list: "/tables/orders" },
  // other resources
];
```

### 7) Create the page

```tsx
// src/app/(dashboard)/tables/orders/page.tsx
"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useState } from "react";
import { ordersConfig, ordersMeta } from "@/examples/orders";
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

## Selectable tables

Enable row selection with `enableSelection` and handle changes via `onSelectionChange`:

```tsx
<PaginationTable
  {...selectablesConfig}
  enableSelection
  onSelectionChange={({ ids }) => console.log(ids)}
/>
```

## Row actions

Use `ActionMenu` to provide per-row actions in a column:

```tsx
{
  id: "actions",
  header: "",
  cell: ({ row, table }) => {
    const meta = table.options.meta as { onEdit?: (id: string) => void; onDelete?: (id: string) => void };
    return <ActionMenu onEdit={() => meta.onEdit?.(row.original.id)} onDelete={() => meta.onDelete?.(row.original.id)} />;
  },
}
```

## Reference

### PaginationTable props (key)

- resource: string — Refine resource name
- columns: ColumnDef<T>[] — TanStack Table columns
- filters?: FilterConfig[]
- pageSizeOptions?: number[]
- defaultPageSize?: number
- enableSearch?: boolean
- searchPlaceholder?: string
- emptyMessage?: string
- className?: string
- getRowId?: (row: T) => string
- permanentFilters?: CrudFilters
- permanentSorters?: CrudSort[]
- onTotalsChange?: ({ totalCount, currentPage, pageSize }) => void
- enableSelection?: boolean
- onSelectionChange?: ({ ids, rows }) => void

### PaginationTableRef methods

- refresh(), resetPage(), getTotalCount(), getCurrentPage(), isLoading()
- getSelectedKeys(), clearSelection(), selectAll()

## Tips

- Keep example modules self-contained: types, repository, columns, config, meta, index.
- Call `tableRef.current?.refresh()` after mutations to sync the UI.
- Swap `createMockRepository` for real API handlers without changing pages.
- Register resources in `_registry.ts` and entries in `resources.ts` so Refine can route.
