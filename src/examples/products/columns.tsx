import type { ColumnDef } from "@tanstack/react-table";
import { ActionMenu, type ChipColor, StatusChip } from "@/infra/ui";
import type { Product, ProductStatus } from "./types";

const statusColorMap: Record<ProductStatus, ChipColor> = {
  available: "success",
  out_of_stock: "warning",
  discontinued: "danger",
};

const statusLabelMap: Record<ProductStatus, string> = {
  available: "Available",
  out_of_stock: "Out of Stock",
  discontinued: "Discontinued",
};

export interface ProductsTableContext {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function createProductsColumns(
  context: ProductsTableContext,
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: (info) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
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
      cell: (info) => (
        <StatusChip
          status={info.getValue() as ProductStatus}
          colorMap={statusColorMap}
          labelMap={statusLabelMap}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const product = info.row.original;
        return (
          <ActionMenu
            onEdit={() => context.onEdit(product)}
            onDelete={() => context.onDelete(product.id)}
          />
        );
      },
    },
  ];
}
