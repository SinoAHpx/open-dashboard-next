import { createPaginationTableModule } from "@/modules/table-module";
import { createProductsConfig } from "@/lib/config/actions-products.config";
import type { Product } from "@/lib/api-wrapper/products";

export interface ProductsTableContext {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const productsTableModule = createPaginationTableModule<
  Product,
  ProductsTableContext
>({
  id: "products-table",
  meta: {
    title: "Product Management",
    description: "Manage your products with full CRUD operations.",
  },
  createConfig: ({ onEdit, onDelete }) =>
    createProductsConfig({
      onEdit,
      onDelete,
    }),
});
