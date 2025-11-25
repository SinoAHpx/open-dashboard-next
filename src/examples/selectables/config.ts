import type { TableConfig, TableMeta } from "@/infra/table";
import { selectablesColumns } from "./columns";
import type { SelectableProduct } from "./types";

export const selectablesMeta: TableMeta = {
  title: "Selectable Products",
  description: "Bulk actions and selection state management.",
};

export const selectablesConfig: TableConfig<SelectableProduct> = {
  resource: "selectables",
  columns: selectablesColumns,
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
