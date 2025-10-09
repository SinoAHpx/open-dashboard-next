import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/components/pagination-table";
import type { SelectableTableConfig } from "@/components/selectable-table";
import {
  getSelectableProductsMock,
  type SelectableProduct,
} from "@/lib/api-wrapper/selectables";

// Adapter function to convert API response to generic format
async function fetchSelectableProducts(
  params: PaginationRequest
): Promise<PaginationResponse<SelectableProduct>> {
  const response = await getSelectableProductsMock({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    category: params.category as string | undefined,
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

// Status color mapping
const statusColorMap: Record<
  SelectableProduct["status"],
  "success" | "warning" | "danger"
> = {
  active: "success",
  "out-of-stock": "warning",
  discontinued: "danger",
};

// Column definitions
const columns: ColumnDef<SelectableProduct>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium">{info.getValue() as string}</span>
        <span className="text-xs text-gray-500">
          {info.row.original.sku}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => (
      <span className="font-medium">${(info.getValue() as number).toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: (info) => {
      const stock = info.getValue() as number;
      return (
        <span
          className={
            stock === 0
              ? "text-red-600"
              : stock < 50
                ? "text-orange-600"
                : "text-green-600"
          }
        >
          {stock} units
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as SelectableProduct["status"];
      return (
        <Chip color={statusColorMap[status]} size="sm" variant="flat">
          {status.charAt(0).toUpperCase() +
            status.slice(1).replace("-", " ")}
        </Chip>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: (info) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "lastRestocked",
    header: "Last Restocked",
    cell: (info) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
];

// Export configuration
export const selectableProductsConfig: SelectableTableConfig<SelectableProduct> =
  {
    columns,
    fetchData: fetchSelectableProducts,
    filters: [
      {
        key: "category",
        label: "Category",
        placeholder: "Filter by category",
        options: [
          { key: "Electronics", label: "Electronics" },
          { key: "Clothing", label: "Clothing" },
          { key: "Home & Garden", label: "Home & Garden" },
          { key: "Sports", label: "Sports" },
          { key: "Books", label: "Books" },
          { key: "Food & Beverage", label: "Food & Beverage" },
          { key: "Toys", label: "Toys" },
          { key: "Beauty", label: "Beauty" },
        ],
      },
      {
        key: "status",
        label: "Status",
        placeholder: "Filter by status",
        options: [
          { key: "active", label: "Active" },
          { key: "out-of-stock", label: "Out of Stock" },
          { key: "discontinued", label: "Discontinued" },
        ],
      },
    ],
    pageSizeOptions: [10, 15, 20, 25, 50],
    defaultPageSize: 15,
    enableSearch: true,
    searchPlaceholder: "Search products by name, SKU, or supplier...",
    emptyMessage: "No products found",
    getRowId: (row) => row.id,
  };
