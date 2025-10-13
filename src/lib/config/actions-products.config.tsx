import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationTableConfig,
  type PaginationRequest,
  type PaginationResponse,
} from "@/lib/config/table-blueprint";
import { getPaginatedProducts, type Product } from "@/lib/api-wrapper/products";

// Adapter function to convert API response to generic format
function fetchPaginatedProducts(
  params: PaginationRequest
): Promise<PaginationResponse<Product>> {
  const response = getPaginatedProducts({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    status: params.status as string | undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return Promise.resolve({
    data: response.data,
    pagination: {
      totalPages: response.pagination.totalPages,
      totalCount: response.pagination.totalCount,
      currentPage: response.pagination.currentPage,
      pageSize: params.pageSize,
    },
  });
}

// Status color mapping
const statusColorMap: Record<
  Product["status"],
  "success" | "warning" | "danger"
> = {
  available: "success",
  out_of_stock: "warning",
  discontinued: "danger",
};

export interface ProductsTableContext {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

// Config factory function that accepts callbacks for row actions
export function createProductsConfig(
  options: ProductsTableContext
): PaginationTableConfig<Product> {
  const { onEdit, onDelete } = options;

  const columns: ColumnDef<Product>[] = [
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
      cell: (info) => {
        const status = info.getValue() as Product["status"];
        return (
          <Chip color={statusColorMap[status]} size="sm" variant="flat">
            {status.replace("_", " ").charAt(0).toUpperCase() +
              status.slice(1).replace("_", " ")}
          </Chip>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const product = info.row.original;
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" aria-label="Actions">
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Product actions">
              <DropdownItem
                key="edit"
                startContent={<PencilSimple size={18} />}
                onPress={() => onEdit(product)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                startContent={<Trash size={18} />}
                color="danger"
                className="text-danger"
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
    fetchData: fetchPaginatedProducts,
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

class ProductsTableBlueprintClass extends PaginationTableBlueprint<
  Product,
  ProductsTableContext
> {
  constructor() {
    super({
      title: "Product Management",
      description: "Manage your products with full CRUD operations.",
    });
  }

  protected buildConfig(
    context: ProductsTableContext
  ): PaginationTableConfig<Product> {
    return createProductsConfig(context);
  }
}

export const productsTableBlueprint = new ProductsTableBlueprintClass();
