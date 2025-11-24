import { Chip, Tooltip } from "@heroui/react";
import { Info } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationTableConfig,
  PaginationTableProps,
} from "@/components/PaginationTable";
import type { SelectableProduct } from "@/lib/api-wrapper/selectables";

export const selectableProductsMeta = {
  title: "Selectable Products",
  description: "Bulk actions and selection state management.",
};

const statusColorMap: Record<
  SelectableProduct["status"],
  "success" | "warning" | "danger"
> = {
  active: "success",
  "out-of-stock": "warning",
  discontinued: "danger",
};

export const selectableProductsColumns: ColumnDef<SelectableProduct>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium">{info.getValue() as string}</span>
        <span className="text-xs text-gray-500">{info.row.original.sku}</span>
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
      <span className="text-gray-600 dark:text-gray-400">
        ${(info.getValue() as number).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as number}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as SelectableProduct["status"];
      return (
        <Chip color={statusColorMap[status]} variant="flat" size="sm">
          {status}
        </Chip>
      );
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "lastRestocked",
    header: () => (
      <div className="flex items-center gap-1">
        Last Restocked
        <Tooltip content="Date of the latest restock action">
          <Info size={14} />
        </Tooltip>
      </div>
    ),
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
];

export const selectableProductsConfig: PaginationTableConfig<SelectableProduct> =
  {
    resource: "selectables",
    columns: selectableProductsColumns,
    filters: [
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
    ],
    pageSizeOptions: [5, 10, 15, 20],
    defaultPageSize: 10,
    enableSearch: true,
    searchPlaceholder: "Search products or suppliers...",
    emptyMessage: "No products found",
  };

export type SelectableProductsTableProps =
  PaginationTableProps<SelectableProduct>;
