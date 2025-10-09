# Pagination Table Guide

This guide explains how to use the universal pagination table boilerplate to quickly create paginated tables with sorting, searching, and filtering.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Contract](#api-contract)
- [Step-by-Step Guide](#step-by-step-guide)
  - [Step 1: API Wrapper & Types](#step-1-api-wrapper--types)
  - [Step 2: Table Configuration](#step-2-table-configuration)
  - [Step 3: Page Component](#step-3-page-component)
- [Adding Row Actions](#adding-row-actions)
- [External Controls](#external-controls)
- [Backend Implementation](#backend-implementation)
- [Advanced Customization](#advanced-customization)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Overview

The pagination table system is a reusable, type-safe solution for creating paginated tables with sorting, searching, and filtering capabilities.

### Why This Approach?

- **Universal**: Works with any data type using TypeScript generics
- **Reusable**: Write once, use anywhere
- **Modular**: Each concern is separated into its own file
- **Type-safe**: Full TypeScript support across all layers
- **Consistent**: Same patterns across all tables
- **Maintainable**: Clear separation of concerns makes updates easy

---

## Architecture

The pagination table system is divided into **three separate parts**, each in its own file:

### 1. API Wrapper & Types (`src/lib/api-wrapper/*.ts`)
- TypeScript interfaces for your data
- API request/response types
- Functions to fetch data from backend
- Mock data generation (optional, for development)

### 2. Table Configuration (`src/lib/config/pagination-*.config.tsx`)
- Column definitions (what to display and how)
- Adapter function (connects API wrapper to table component)
- Filter configurations
- Table settings (search, pagination options)

### 3. Page Component (`src/app/(dashboard)/*/page.tsx`)
- The actual page that renders the table
- Custom headers and descriptions
- Action buttons (Add, Export, etc.)
- Event handlers (Edit, Delete, etc.)

### Data Flow

```
Backend API → API Wrapper → Config Adapter → PaginationTable Component → Page
```

---

## Quick Start

Here's a minimal example to create a paginated users table:

### 1. API Wrapper & Types

```typescript
// src/lib/api-wrapper/users.ts
export interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
}

export interface UsersPaginationResponse {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function getUsers(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<UsersPaginationResponse> {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  });

  const response = await fetch(`/api/users?${queryParams}`);
  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
}
```

### 2. Table Configuration

```tsx
// src/lib/config/pagination-users.config.tsx
import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationTableConfig,
  PaginationRequest,
  PaginationResponse,
} from "@/components/pagination-table";
import { getUsers, type User } from "@/lib/api-wrapper/users";

// Adapter function
async function fetchUsers(
  params: PaginationRequest
): Promise<PaginationResponse<User>> {
  const response = await getUsers({
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

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => <span>{info.getValue() as string}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as User["status"];
      const colorMap = { active: "success", pending: "warning", inactive: "danger" };
      return (
        <Chip color={colorMap[status]} size="sm" variant="flat">
          {status}
        </Chip>
      );
    },
  },
];

// Export configuration
export const usersTableConfig: PaginationTableConfig<User> = {
  columns,
  fetchData: fetchUsers,
  filters: [
    {
      key: "status",
      label: "Filter by status",
      placeholder: "Filter by status",
      options: [
        { key: "active", label: "Active" },
        { key: "pending", label: "Pending" },
        { key: "inactive", label: "Inactive" },
      ],
    },
  ],
  enableSearch: true,
  searchPlaceholder: "Search users...",
  emptyMessage: "No users found",
};
```

### 3. Page Component

```tsx
// src/app/(dashboard)/users/page.tsx
"use client";

import { useRef } from "react";
import { PaginationTable, type PaginationTableRef } from "@/components/pagination-table";
import { usersTableConfig } from "@/lib/config/pagination-users.config";

export default function UsersPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-2 text-gray-600">Manage user accounts</p>
      </div>

      <PaginationTable ref={tableRef} {...usersTableConfig} />
    </div>
  );
}
```

That's it! You now have a fully functional paginated table.

---

## API Contract

Your backend API must follow this contract for the table to work properly.

### Request Parameters

The table sends these query parameters:

```typescript
{
  page: number;          // Current page (1-based)
  pageSize: number;      // Items per page
  search?: string;       // Search query (if enabled)
  sortBy?: string;       // Column to sort by
  sortOrder?: "asc" | "desc";  // Sort direction
  [filterKey]?: string;  // Any additional filters you defined
}
```

### Response Format

Your API must return this structure:

```typescript
{
  data: T[];  // Array of items for current page
  pagination: {
    totalPages: number;    // Total number of pages
    totalCount: number;    // Total number of items
    page: number;          // Current page number (or currentPage)
    pageSize: number;      // Items per page
  };
}
```

### Example API Response

```json
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active"
    }
  ],
  "pagination": {
    "totalPages": 10,
    "totalCount": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## Step-by-Step Guide

### Step 1: API Wrapper & Types

Create a new file in `src/lib/api-wrapper/` for your data operations.

**File: `src/lib/api-wrapper/orders.ts`**

```typescript
// 1. Define your data interface
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

// 2. Define response interface
export interface OrdersPaginationResponse {
  data: Order[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// 3. Define request parameters interface
export interface GetOrdersParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 4. Create fetch function
export async function getOrders(
  params: GetOrdersParams
): Promise<OrdersPaginationResponse> {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
  });

  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.sortBy) {
    queryParams.append("sortBy", params.sortBy);
    queryParams.append("sortOrder", params.sortOrder || "asc");
  }

  const response = await fetch(`/api/orders?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}
```

**Optional: Mock Data for Development**

```typescript
// Add to the same file
import { faker } from "@faker-js/faker";

function generateMockOrders(count: number): Order[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    customerName: faker.person.fullName(),
    total: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    status: faker.helpers.arrayElement(["pending", "completed", "cancelled"]),
    createdAt: faker.date.recent({ days: 90 }).toISOString().split("T")[0],
  }));
}

// Export mock function for development
export async function getOrdersMock(
  params: GetOrdersParams
): Promise<OrdersPaginationResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

  let filtered = generateMockOrders(100);

  // Apply search, filter, sort, pagination logic here...
  // (See richcell.ts for a complete example)

  return {
    data: filtered.slice(0, params.pageSize),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / params.pageSize),
    },
  };
}
```

---

### Step 2: Table Configuration

Create a new file in `src/lib/config/` for your table configuration.

**File: `src/lib/config/pagination-orders.config.tsx`**

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationTableConfig,
  PaginationRequest,
  PaginationResponse,
} from "@/components/pagination-table";
import { getOrders, type Order } from "@/lib/api-wrapper/orders";
// Or use getOrdersMock for development

// 1. Adapter function - bridges API wrapper and table component
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

  // Transform API response to match table's expected format
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

// 2. Column definitions - what to display and how
const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: (info) => <span>${(info.getValue() as number).toFixed(2)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => <span>{info.getValue() as string}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (info) => <span>{info.getValue() as string}</span>,
  },
];

// 3. Export configuration object
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
  searchPlaceholder: "Search orders...",
  emptyMessage: "No orders found",
};
```

---

### Step 3: Page Component

Create a new page in `src/app/(dashboard)/` for your table.

**File: `src/app/(dashboard)/orders/page.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { PaginationTable, type PaginationTableRef } from "@/components/pagination-table";
import { ordersTableConfig } from "@/lib/config/pagination-orders.config";

export default function OrdersPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-gray-600">
          Manage customer orders. Total: {tableRef.current?.getTotalCount() || 0}
        </p>
      </div>

      <PaginationTable ref={tableRef} {...ordersTableConfig} />
    </div>
  );
}
```

---

## Adding Row Actions

For tables with edit/delete/view actions, use a factory function pattern.

### Updated Configuration (Factory Pattern)

**File: `src/lib/config/pagination-products.config.tsx`**

```tsx
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
// ... other imports

export function createProductsConfig(options: {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}): PaginationTableConfig<Product> {
  const { onEdit, onDelete } = options;

  const columns: ColumnDef<Product>[] = [
    // ... your data columns ...
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const product = info.row.original;
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                startContent={<PencilSimple size={18} />}
                onPress={() => onEdit(product)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                startContent={<Trash size={18} />}
                color="danger"
                onPress={() => onDelete(product.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  return {
    columns,
    fetchData: fetchProducts,
    // ... rest of config
  };
}
```

### Updated Page Component

**File: `src/app/(dashboard)/products/page.tsx`**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { PaginationTable, type PaginationTableRef } from "@/components/pagination-table";
import { createProductsConfig } from "@/lib/config/pagination-products.config";
import { deleteProduct } from "@/lib/api-wrapper/products";

export default function ProductsPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  const handleEdit = (product: Product) => {
    console.log("Editing:", product);
    // Open modal or navigate to edit page
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteProduct(id);
      tableRef.current?.refresh();
    }
  };

  // Create config with callbacks
  const config = useMemo(
    () =>
      createProductsConfig({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <h1>Products</h1>
      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
```

---

## External Controls

The table exposes methods via `ref` for external control.

### Available Methods

```typescript
interface PaginationTableRef {
  refresh: () => void;         // Reload current page
  resetPage: () => void;       // Go to page 1
  getTotalCount: () => number; // Get total items count
  getCurrentPage: () => number;// Get current page
  isLoading: () => boolean;    // Check loading state
}
```

### Example: Add Button with Refresh

```tsx
export default function ProductsPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  const handleAdd = () => {
    addProduct(newProduct);
    tableRef.current?.refresh();
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 flex justify-between">
        <h1>Products</h1>
        <Button onPress={handleAdd}>Add Product</Button>
      </div>

      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
```

---

## Backend Implementation

### Next.js API Route Example

**File: `src/app/api/orders/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Your database query logic here
  const { data, totalCount } = await fetchOrdersFromDB({
    page,
    pageSize,
    search,
    status,
    sortBy,
    sortOrder,
  });

  return NextResponse.json({
    data,
    pagination: {
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
      page,
      pageSize,
    },
  });
}
```

### Node.js/Express Example

```javascript
app.get("/api/orders", async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    status = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build query
  let query = db("orders");

  // Apply search
  if (search) {
    query = query
      .where("customerName", "like", `%${search}%`)
      .orWhere("id", "like", `%${search}%`);
  }

  // Apply filters
  if (status) {
    query = query.where("status", status);
  }

  // Apply sorting
  query = query.orderBy(sortBy, sortOrder);

  // Get total count
  const totalCount = await query.clone().count("* as count").first();

  // Apply pagination
  const offset = (page - 1) * pageSize;
  const data = await query.limit(pageSize).offset(offset);

  // Send response
  res.json({
    data,
    pagination: {
      totalPages: Math.ceil(totalCount.count / pageSize),
      totalCount: totalCount.count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
  });
});
```

---

## Advanced Customization

### Multiple Filters

```tsx
export const config: PaginationTableConfig<Product> = {
  // ...
  filters: [
    {
      key: "status",
      label: "Status",
      placeholder: "Filter by status",
      options: [
        { key: "active", label: "Active" },
        { key: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "category",
      label: "Category",
      placeholder: "Filter by category",
      options: [
        { key: "electronics", label: "Electronics" },
        { key: "clothing", label: "Clothing" },
      ],
    },
  ],
};
```

### Custom Page Sizes

```tsx
export const config: PaginationTableConfig<Product> = {
  // ...
  pageSizeOptions: [10, 25, 50, 100],
  defaultPageSize: 25,
};
```

### Disable Search

```tsx
export const config: PaginationTableConfig<Product> = {
  // ...
  enableSearch: false,
};
```

---

## Common Patterns

### Pattern 1: Simple Read-Only Table

Best for: Logs, reports, view-only data

**Files:**
- `src/lib/api-wrapper/logs.ts` - Data types & fetch function
- `src/lib/config/pagination-logs.config.tsx` - Column definitions
- `src/app/(dashboard)/logs/page.tsx` - Page component

### Pattern 2: Table with CRUD Operations

Best for: Product management, user management

**Files:**
- `src/lib/api-wrapper/products.ts` - CRUD operations
- `src/lib/config/pagination-products.config.tsx` - Factory function
- `src/app/(dashboard)/products/page.tsx` - Page with handlers

### Pattern 3: Rich Interactive Cells

Best for: Task management, project boards

**Files:**
- `src/lib/api-wrapper/tasks.ts` - Task operations
- `src/lib/config/pagination-tasks.config.tsx` - Rich cell components
- `src/app/(dashboard)/tasks/page.tsx` - Interactive page

See `src/app/(dashboard)/rich-cell/page.tsx` for a complete example with:
- Avatars
- Editable inputs
- Progress bars
- Multiple filters
- Action menus

---

## Troubleshooting

### Table shows no data but API returns data

Check that your API response matches the expected format exactly with `data` and `pagination` fields.

### Page scrolls instead of table scrolling

Make sure your page wrapper has: `className="flex flex-1 min-h-0 flex-col p-8"`

### Refresh not working after CRUD operations

Always call `tableRef.current?.refresh()` after mutations.

### Filters not working

Make sure your backend reads all filter parameters from the query string.

---

## Migration Checklist

When creating a new table:

**Step 1: API Wrapper**
- [ ] Create file in `src/lib/api-wrapper/`
- [ ] Define TypeScript data interface
- [ ] Define response interface
- [ ] Create fetch function
- [ ] (Optional) Add mock data function

**Step 2: Configuration**
- [ ] Create file in `src/lib/config/`
- [ ] Import API wrapper and types
- [ ] Create adapter function
- [ ] Define columns with proper types
- [ ] Add filters if needed
- [ ] Export config (or factory function for actions)

**Step 3: Page Component**
- [ ] Create page in `src/app/(dashboard)/`
- [ ] Import config
- [ ] Add page wrapper with proper flex classes
- [ ] Spread config into PaginationTable
- [ ] Add ref if you need external controls
- [ ] (Optional) Add action handlers for CRUD

**Step 4: Backend (if not using mock)**
- [ ] Create API route
- [ ] Implement pagination logic
- [ ] Implement search logic
- [ ] Implement filter logic
- [ ] Implement sort logic
- [ ] Return correct response format

**Step 5: Testing**
- [ ] Test pagination
- [ ] Test search
- [ ] Test sorting
- [ ] Test filters
- [ ] Test CRUD operations (if applicable)

That's it! You now have a complete understanding of the pagination table system.
