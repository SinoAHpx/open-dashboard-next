# Table Blueprint Guide

This project ships a small set of “table blueprints” that keep every table page consistent: configs declare metadata and behaviour, pages only consume the blueprint, and shared UI primitives take care of layout.

## Architecture Snapshot

- **API wrappers (`src/lib/api-wrapper/*`)** – strongly typed accessors for your backend (or mocks while prototyping).
- **Table blueprints (`src/lib/config/*`)** – each config file extends a base class from `table-blueprint.ts`, bundling table metadata, columns, filters, adapters, and (for paginated tables) the Zustand store factory.
- **UI primitives (`src/components/table/*`)** – `TablePage`, `TableToolbar`, and `TablePaginationControls` render the standard shell; `PaginationTable` and `SelectableTable` handle client state and URL syncing.


## Step 1 – API Wrapper & Types

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
    ...(params.sortBy && {
      sortBy: params.sortBy,
      sortOrder: params.sortOrder ?? "asc",
    }),
  });

  const res = await fetch(`/api/orders?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
```

## Step 2 – Table Blueprint

Each config file now exports a blueprint object that extends a base class. The base class enforces metadata and provides `createInstance` which returns `{ store, config, meta }`.

```tsx
// src/lib/config/orders-table.config.tsx
import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationRequest,
  type PaginationResponse,
  type PaginationTableConfig,
} from "@/lib/config/table-blueprint";
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
  {
    accessorKey: "total",
    header: "Total",
    cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
  },
  { accessorKey: "createdAt", header: "Date" },
];

const ordersTableConfig: PaginationTableConfig<Order> = {
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
  searchPlaceholder: "Search orders...",
  emptyMessage: "No orders found",
};

class OrdersTableBlueprint extends PaginationTableBlueprint<Order> {
  constructor() {
    super({
      title: "Orders",
      description: "Manage customer orders.",
    });
  }

  protected buildConfig(): PaginationTableConfig<Order> {
    return ordersTableConfig;
  }
}

export const ordersTableBlueprint = new OrdersTableBlueprint();
```

For tables that require callbacks (e.g. edit/delete handlers) pass a context object to `createInstance` and forward it inside `buildConfig`. Selectable tables work the same way via `SelectableTableBlueprint`, and can override `buildActions` to populate floating menus.

## Step 3 – Page Component

Pages read metadata, config, and store from the blueprint. The UI remains concise and predictable.

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
import { ordersTableBlueprint } from "@/lib/config/orders-table.config";

export default function OrdersPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { store, config, meta } = useMemo(
    () => ordersTableBlueprint.createInstance(undefined),
    []
  );
  const totalCount = store((state) => state.totalCount);

  return (
    <TablePage
      title={meta.title}
      description={`${meta.description ?? ""}${
        meta.description ? " " : ""
      }Total orders: ${totalCount}`}
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

`SelectableTableBlueprint` mirrors the pagination blueprint but skips the Zustand store and optionally supplies floating actions.

```tsx
const tableConfig = useMemo(
  () => selectableProductsBlueprint.createConfig(undefined),
  []
);

const floatingActions = useMemo(
  () =>
    selectableProductsBlueprint.createActions({
      selectedIds,
      onClear: handleClearSelection,
      onRefresh: handleRefresh,
      onEdit: handleEditSelected,
    }),
  [handleClearSelection, handleEditSelected, handleRefresh, selectedIds]
);
```

Inside `buildActions` (see `src/lib/config/selectable-products.config.tsx`) you can react to the provided context and return an array of `FloatingAction` items for the `FloatingActionMenu`.

## API Contract (Recap)

- Requests supply `page`, `pageSize`, optional `search`, `sortBy`, `sortOrder`, plus any custom filters.
- Responses must return `{ data: T[], pagination: { page, pageSize, totalCount, totalPages } }`.
- If the backend deviates, adapt it inside the config’s `fetchData` function—no page changes required.

## Tips

- Keep configs declarative: derive metadata, filters, and actions in one place.
- When callbacks mutate data, call `tableRef.current?.refresh()` to stay in sync.
- Use the shared toolbar and pagination components for consistent UX without manual wiring.
