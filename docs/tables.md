# Pagination Table Guide

This guide explains how to use the universal pagination table boilerplate to quickly create paginated tables with sorting, searching, and filtering.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Contract](#api-contract)
- [Creating a Simple Table](#creating-a-simple-table)
- [Adding Row Actions](#adding-row-actions)
- [External Controls](#external-controls)
- [Backend Implementation](#backend-implementation)
- [Advanced Customization](#advanced-customization)

---

## Overview

The pagination table system consists of three main parts:

1. **PaginationTable Component** - The reusable table component (in `src/components/pagination-table.tsx`)
2. **Table Configuration** - Column definitions and API integration (in `src/lib/config/`)
3. **Page Wrapper** - The page that uses the table with custom headers and actions

### Why This Approach?

- **Universal**: Works with any data type using TypeScript generics
- **Reusable**: Write the config once, use it anywhere
- **Modular**: Easy to compose with other components (modals, buttons, etc.)
- **Type-safe**: Full TypeScript support
- **Consistent**: Same patterns across all tables

---

## Quick Start

### 1. Create Your Configuration File

Create a new file in `src/lib/config/` for your table config:

```tsx
// src/lib/config/pagination-orders.config.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationTableConfig,
  PaginationRequest,
  PaginationResponse,
} from "@/components/pagination-table";

// Your data type
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

// API adapter function
async function fetchOrders(
  params: PaginationRequest
): Promise<PaginationResponse<Order>> {
  const response = await fetch(`/api/orders?${new URLSearchParams({
    page: params.page.toString(),
    pageSize: params.pageSize.toString(),
    search: params.search || "",
    status: params.status as string || "",
    sortBy: params.sortBy || "",
    sortOrder: params.sortOrder || "",
  })}`);

  return response.json();
}

// Column definitions
const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
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

// Export configuration
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

### 2. Use It In Your Page

```tsx
// src/app/(dashboard)/orders/page.tsx
"use client";

import { PaginationTable } from "@/components/pagination-table";
import { ordersTableConfig } from "@/lib/config/pagination-orders.config";

export default function OrdersPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-gray-600">Manage customer orders</p>
      </div>

      <PaginationTable {...ordersTableConfig} />
    </div>
  );
}
```

That's it! You now have a fully functional paginated table with search, filtering, and sorting.

---

## API Contract

Your backend API must follow this contract for the table to work properly.

### Request Parameters

The table will send these query parameters:

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
    currentPage: number;   // Current page number
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
      "customerName": "John Doe",
      "total": 299.99,
      "status": "completed",
      "createdAt": "2024-01-15"
    }
  ],
  "pagination": {
    "totalPages": 10,
    "totalCount": 100,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

---

## Creating a Simple Table

For a read-only table without actions, use the pattern shown in Quick Start.

### Key Points

1. **Define your data type** - TypeScript interface for your data
2. **Create fetch function** - Adapter that calls your API
3. **Define columns** - What data to display and how
4. **Configure filters** (optional) - Dropdown filters for your data
5. **Export config** - Single object with all settings

### Column Customization

You can customize how each column displays data:

```tsx
{
  accessorKey: "price",
  header: "Price",
  cell: (info) => {
    const price = info.getValue() as number;
    return (
      <span className="font-bold text-green-600">
        ${price.toFixed(2)}
      </span>
    );
  },
}
```

---

## Adding Row Actions

For tables with edit/delete/view actions (like the Products table), use a factory function pattern.

### Configuration with Actions

```tsx
// src/lib/config/pagination-products.config.tsx
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";

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

### Using the Factory Config

```tsx
"use client";

import { useRef, useMemo } from "react";
import { PaginationTable, type PaginationTableRef } from "@/components/pagination-table";
import { createProductsConfig } from "@/lib/config/pagination-products.config";
import { deleteProduct } from "@/lib/api-wrapper/products";

export default function ProductsPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  const handleEdit = (product: Product) => {
    // Handle edit logic
    console.log("Editing:", product);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      deleteProduct(id);
      tableRef.current?.refresh();  // Refresh table after deletion
    }
  };

  // Create config with callbacks
  const config = useMemo(
    () => createProductsConfig({
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
  refresh: () => void;              // Reload current page
  resetPage: () => void;            // Go to page 1
  getTotalCount: () => number;      // Get total items count
  getCurrentPage: () => number;     // Get current page
  isLoading: () => boolean;         // Check loading state
}
```

### Example: Add Button with Refresh

```tsx
export default function ProductsPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  const handleAdd = () => {
    // Add product logic here
    addProduct(newProduct);

    // Refresh table to show new product
    tableRef.current?.refresh();
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 flex justify-between">
        <h1>Products</h1>
        <Button onPress={handleAdd}>
          Add Product
        </Button>
      </div>

      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
```

### Example: Display Total Count

```tsx
export default function ProductsPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6">
        <h1>Products</h1>
        <p>Total products: {tableRef.current?.getTotalCount() || 0}</p>
      </div>

      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
```

---

## Backend Implementation

### Node.js/Express Example

```javascript
// routes/orders.js
app.get('/api/orders', async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  let query = db('orders');

  // Apply search
  if (search) {
    query = query.where('customerName', 'like', `%${search}%`)
                 .orWhere('id', 'like', `%${search}%`);
  }

  // Apply filters
  if (status) {
    query = query.where('status', status);
  }

  // Apply sorting
  query = query.orderBy(sortBy, sortOrder);

  // Get total count
  const totalCount = await query.clone().count('* as count').first();

  // Apply pagination
  const offset = (page - 1) * pageSize;
  const data = await query.limit(pageSize).offset(offset);

  // Send response
  res.json({
    data,
    pagination: {
      totalPages: Math.ceil(totalCount.count / pageSize),
      totalCount: totalCount.count,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
    },
  });
});
```

### Next.js API Route Example

```typescript
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

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
      currentPage: page,
      pageSize,
    },
  });
}
```

### Client-Side Only (LocalStorage) Example

```typescript
// lib/api-wrapper/products.ts
export function getPaginatedProducts(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  let products = getProducts(); // Get from localStorage

  // Filter by search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.status) {
    products = products.filter((p) => p.status === params.status);
  }

  // Sort
  if (params.sortBy) {
    products.sort((a, b) => {
      const aVal = a[params.sortBy as keyof Product];
      const bVal = b[params.sortBy as keyof Product];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return params.sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return params.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  // Paginate
  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = products.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      totalPages,
      totalCount,
      currentPage: params.page,
      pageSize: params.pageSize,
    },
  };
}
```

---

## Advanced Customization

### Custom Styling

You can pass custom classes to the table:

```tsx
<PaginationTable
  {...config}
  className="custom-table-class"
/>
```

### Multiple Filters

Add as many filters as you need:

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

### Disable Search or Change Placeholder

```tsx
export const config: PaginationTableConfig<Product> = {
  // ...
  enableSearch: false,  // Disable search entirely
  // OR
  searchPlaceholder: "Search by name or SKU...",  // Custom placeholder
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

### Custom Empty Message

```tsx
export const config: PaginationTableConfig<Product> = {
  // ...
  emptyMessage: "No products available. Add your first product to get started.",
};
```

---

## Common Patterns

### Pattern 1: Simple Read-Only Table

Use when you just need to display data with pagination and search.

**Best for**: Logs, reports, view-only data

```tsx
// Config
export const logsConfig: PaginationTableConfig<Log> = {
  columns,
  fetchData: fetchLogs,
  enableSearch: true,
};

// Page
export default function LogsPage() {
  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <h1>Logs</h1>
      <PaginationTable {...logsConfig} />
    </div>
  );
}
```

### Pattern 2: Table with CRUD Operations

Use when you need to create, edit, and delete items.

**Best for**: Product management, user management, content management

```tsx
// Config with factory
export function createUsersConfig(options: {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}) {
  // ... config with actions column
}

// Page with modal and external controls
export default function UsersPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAdd = () => onOpen();
  const handleEdit = (user) => { /* ... */ };
  const handleDelete = (id) => {
    deleteUser(id);
    tableRef.current?.refresh();
  };

  const config = useMemo(
    () => createUsersConfig({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 flex justify-between">
        <h1>Users</h1>
        <Button onPress={handleAdd}>Add User</Button>
      </div>

      <PaginationTable ref={tableRef} {...config} />

      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Add/Edit form */}
      </Modal>
    </div>
  );
}
```

### Pattern 3: Table with Bulk Actions

Use when you need to perform actions on multiple items.

**Best for**: Email campaigns, bulk delete, batch operations

```tsx
export default function EmailsPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBulkDelete = () => {
    bulkDeleteEmails(selectedIds);
    setSelectedIds([]);
    tableRef.current?.refresh();
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 flex justify-between">
        <h1>Emails</h1>
        <Button
          onPress={handleBulkDelete}
          isDisabled={selectedIds.length === 0}
        >
          Delete Selected ({selectedIds.length})
        </Button>
      </div>

      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
```

---

## Troubleshooting

### Table shows no data but API returns data

Check that your API response matches the expected format exactly:

```typescript
{
  data: [...],           // Must be called "data"
  pagination: {          // Must be called "pagination"
    totalPages: number,
    totalCount: number,
    currentPage: number,
    pageSize: number,
  }
}
```

### Page scrolls instead of table scrolling

Make sure your page wrapper has the correct classes:

```tsx
<div className="flex flex-1 min-h-0 flex-col p-8">
  {/* ... */}
</div>
```

The key classes are `flex-1 min-h-0` which allow the flex layout to work properly.

### Refresh not working after CRUD operations

Always call `tableRef.current?.refresh()` after mutations:

```tsx
const handleDelete = (id: string) => {
  deleteProduct(id);
  tableRef.current?.refresh();  // Don't forget this!
};
```

### Filters not working

Make sure your backend reads all filter parameters from the query string and applies them to your database query. The table will send any filter with its `key` as the query parameter name.

---

## Migration Checklist

When creating a new table, follow this checklist:

- [ ] Define your TypeScript data interface
- [ ] Create API endpoint that follows the contract
- [ ] Create config file in `src/lib/config/`
- [ ] Write fetch adapter function
- [ ] Define columns with proper types
- [ ] Add filters if needed
- [ ] Export config object (or factory function for actions)
- [ ] Create page component
- [ ] Add page wrapper with proper flex classes
- [ ] Import and spread config into PaginationTable
- [ ] Add ref if you need external controls
- [ ] Test pagination, search, sorting, and filters

That's it! You now have a complete understanding of the pagination table system.
