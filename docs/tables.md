# Table Modules Guide

This guide explains how to build table pages quickly using the shared modules, layouts, and Zustand-powered stores that ship with the dashboard.

## Architecture At A Glance

- **API wrappers (`src/lib/api-wrapper/*`)**: Typed fetchers or mocks that hide the backend contract.
- **Table configs (`src/lib/config/*`)**: Column definitions, filter metadata, and adapters that map API responses to the table shape.
- **Modules (`src/modules/tables/*`)**: Lightweight factories built with `createPaginationTableModule` or `createSelectableTableModule`. A module wraps metadata, the table config, and (for paginated tables) a ready-to-use Zustand store.
- **UI primitives (`src/components/table/*`)**:
  - `TablePage` renders the standard header, description, and action row.
  - `TableToolbar` and `TablePaginationControls` provide consistent search, filters, refresh, and pagination UI.
  - `PaginationTable` and `SelectableTable` compose everything together and keep state in sync with the URL.

## Step-by-Step

### Step 1 – API Wrapper & Types

```ts
// src/lib/api-wrapper/orders.ts
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getOrders(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<OrdersResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
    ...(params.sortBy && { sortBy: params.sortBy, sortOrder: params.sortOrder ?? "asc" }),
  });

  const res = await fetch(`/api/orders?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
```

### Step 2 – Table Configuration

```tsx
// src/lib/config/orders-table.config.tsx
import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationRequest,
  PaginationResponse,
  PaginationTableConfig,
} from "@/components/PaginationTable";
import { getOrders, type Order } from "@/lib/api-wrapper/orders";

async function fetchOrders(
  params: PaginationRequest
): Promise<PaginationResponse<Order>> {
  const response = await getOrders({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    status: params.status as string | undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return {
    data: response.data,
    pagination: {
      totalPages: response.pagination.totalPages,
      totalCount: response.pagination.totalCount,
      currentPage: response.pagination.page,
      pageSize: response.pagination.pageSize,
    },
  };
}

const columns: ColumnDef<Order>[] = [
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <Chip size="sm" variant="flat">
        {info.getValue<string>().toUpperCase()}
      </Chip>
    ),
  },
  { accessorKey: "total", header: "Total", cell: (info) => `$${info.getValue<number>().toFixed(2)}` },
  { accessorKey: "createdAt", header: "Date" },
];

export const ordersTableConfig: PaginationTableConfig<Order> = {
  columns,
  fetchData: fetchOrders,
  filters: [
    {
      key: "status",
      label: "Filter by status",
      placeholder: "Filter by status",
      options: [
        { key: "pending", label: "Pending" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
      ],
    },
  ],
  enableSearch: true,
  searchPlaceholder: "Search orders…",
  emptyMessage: "No orders found",
};
```

### Step 3 – Table Module

```ts
// src/modules/tables/orders-table.module.ts
import { createPaginationTableModule } from "@/modules/table-module";
import { ordersTableConfig } from "@/lib/config/orders-table.config";
import type { Order } from "@/lib/api-wrapper/orders";

export const ordersTableModule = createPaginationTableModule<Order>({
  id: "orders-table",
  meta: {
    title: "Orders",
    description: "Manage customer orders.",
  },
  createConfig: () => ordersTableConfig,
});
```

For selectable tables, swap in `createSelectableTableModule` and pass `createFloatingActions` if you need bulk actions.

### Step 4 – Page Component

```tsx
// src/app/(dashboard)/orders/page.tsx
"use client";

import { useMemo, useRef, Suspense } from "react";
import { Spinner } from "@heroui/react";
import {
  PaginationTable,
  type PaginationTableRef,
} from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { ordersTableModule } from "@/modules/tables/orders-table.module";

export default function OrdersPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { store, config } = useMemo(
    () => ordersTableModule.createInstance(undefined),
    []
  );
  const totalCount = store((state) => state.totalCount);

  return (
    <TablePage
      title={ordersTableModule.meta.title}
      description={`${ordersTableModule.meta.description} Total: ${totalCount}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable ref={tableRef} store={store} {...config} />
      </Suspense>
    </TablePage>
  );
}
```

## Selectable Tables

`SelectableTable` extends the same layout with multi-select support and a floating action bar.

- Use `createSelectableTableModule` to wire the config and floating actions.
- Pass `onSelectionChange` to receive selected IDs/rows and drive UI badges or action states.
- Pass `onStateChange` to keep the header in sync with `totalCount`, `page`, or loading status.

Example page wiring:

```tsx
const { config } = useMemo(
  () => selectableProductsModule.createInstance(undefined),
  []
);

const floatingActions = useMemo(
  () =>
    selectableProductsModule.createFloatingActions?.({
      selectedIds,
      onClear: handleClearSelection,
      onRefresh: handleRefresh,
      onEdit: handleEditSelected,
    }) ?? [],
  [selectedIds, handleClearSelection, handleRefresh, handleEditSelected]
);

<SelectableTable
  ref={tableRef}
  {...config}
  onStateChange={setTableState}
  onSelectionChange={({ ids }) => {
    setSelectedIds(ids);
    setSelectedCount(ids.length);
  }}
/>;
```

## Shared UI Primitives

- `TablePage` keeps headings, descriptions, and action buttons consistent across dashboards.
- `TableToolbar` (used internally by both table components) provides search, filters, and refresh controls.
- `TablePaginationControls` renders the page-size selector and pagination widget.

These components live in `src/components/table` and are safe to use in custom layouts when needed.

## API Contract (recap)

Requests include `page`, `pageSize`, optional `search`, `sortBy`, `sortOrder`, and any filter keys you defined. Responses must return:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalCount": 100,
    "totalPages": 10
  }
}
```

If your backend uses a different shape, adapt it in the config’s `fetchData` function before handing it to the table.

## Tips

- Keep configs focused on presentation; handle side-effects (editing, deleting) inside the page or module callbacks.
- Use modules to co-locate metadata (title, description) so headers stay in sync with future design updates.
- For mock data, leverage the provided Faker helpers in the API wrappers until real endpoints are ready.
- When adding new filters, just update the config: the toolbar and URL sync will pick them up automatically.
