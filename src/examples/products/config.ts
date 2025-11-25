import type { TableConfig, TableMeta } from "@/infra/table";
import { createProductsColumns, type ProductsTableContext } from "./columns";
import type { Product } from "./types";

export const productsMeta: TableMeta = {
  title: "Product Management",
  description: "Manage your products with full CRUD operations.",
};

export function createProductsConfig(
  context: ProductsTableContext,
): TableConfig<Product> {
  return {
    resource: "products",
    columns: createProductsColumns(context),
    filters: [
      {
        key: "status",
        label: "Filter by status",
        placeholder: "Filter by status",
        options: [
          { key: "available", label: "Available" },
          { key: "out_of_stock", label: "Out of Stock" },
          { key: "discontinued", label: "Discontinued" },
        ],
      },
    ],
    pageSizeOptions: [5, 10, 15, 20, 25, 50],
    defaultPageSize: 10,
    enableSearch: true,
    searchPlaceholder: "Search products...",
    emptyMessage: "No products found",
  };
}
