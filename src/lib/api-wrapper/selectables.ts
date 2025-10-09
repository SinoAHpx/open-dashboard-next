import { faker } from "@faker-js/faker";

export interface SelectableProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "out-of-stock" | "discontinued";
  supplier: string;
  lastRestocked: string;
}

export interface SelectablesPaginationResponse {
  data: SelectableProduct[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface GetSelectableProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Generate mock products with Faker
function generateMockProducts(count: number): SelectableProduct[] {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Food & Beverage",
    "Toys",
    "Beauty",
  ];
  const statuses: SelectableProduct["status"][] = [
    "active",
    "out-of-stock",
    "discontinued",
  ];

  return Array.from({ length: count }, (_, i) => {
    const productName = faker.commerce.productName();
    const category = faker.helpers.arrayElement(categories);
    const status = faker.helpers.arrayElement(statuses);

    return {
      id: faker.string.uuid(),
      name: productName,
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      category,
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
      stock: status === "out-of-stock" ? 0 : faker.number.int({ min: 0, max: 500 }),
      status,
      supplier: faker.company.name(),
      lastRestocked: faker.date
        .between({
          from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          to: new Date(),
        })
        .toISOString()
        .split("T")[0],
    };
  });
}

// Cache for mock data
let cachedProducts: SelectableProduct[] | null = null;

function getMockProducts(): SelectableProduct[] {
  if (!cachedProducts) {
    cachedProducts = generateMockProducts(150);
  }
  return cachedProducts;
}

export async function getSelectableProducts(
  params: GetSelectableProductsParams = {}
): Promise<SelectablesPaginationResponse> {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    category = "",
    status = "",
    sortBy = "",
    sortOrder = "asc",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  if (category) {
    queryParams.append("category", category);
  }

  if (status) {
    queryParams.append("status", status);
  }

  if (sortBy) {
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);
  }

  const response = await fetch(`/api/selectables?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch selectable products");
  }

  const data: SelectablesPaginationResponse = await response.json();
  return data;
}

// Client-side mock function (for development without backend)
export async function getSelectableProductsMock(
  params: GetSelectableProductsParams = {}
): Promise<SelectablesPaginationResponse> {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    category = "",
    status = "",
    sortBy = "",
    sortOrder = "asc",
  } = params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...getMockProducts()];

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.supplier.toLowerCase().includes(searchLower)
    );
  }

  // Apply filters
  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }
  if (status) {
    filtered = filtered.filter((product) => product.status === status);
  }

  // Apply sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof SelectableProduct];
      const bVal = b[sortBy as keyof SelectableProduct];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  // Paginate
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}

// Mock functions for bulk operations
export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  console.log("Bulk deleting products:", ids);
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would make an API call
}

export async function bulkUpdateStatus(
  ids: string[],
  status: SelectableProduct["status"]
): Promise<void> {
  console.log("Bulk updating product status:", ids, status);
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would make an API call
}

export async function bulkExportProducts(ids: string[]): Promise<void> {
  console.log("Bulk exporting products:", ids);
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would trigger a download
}
