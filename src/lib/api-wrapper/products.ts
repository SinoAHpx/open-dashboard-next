import { faker } from "@faker-js/faker";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "available" | "out_of_stock" | "discontinued";
  description: string;
  sku: string;
  createdAt: string;
};

const STORAGE_KEY = "products";

// Get all products from localStorage
export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Get paginated products with filtering and sorting
export function getPaginatedProducts(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): {
  data: Product[];
  pagination: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
  };
} {
  let products = getProducts();

  // Filter by search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower),
    );
  }

  // Filter by status
  if (params.status) {
    products = products.filter((product) => product.status === params.status);
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
  const paginatedProducts = products.slice(start, end);

  return {
    data: paginatedProducts,
    pagination: {
      totalPages,
      totalCount,
      currentPage: params.page,
    },
  };
}

// Add a new product
export function addProduct(
  product: Omit<Product, "id" | "createdAt">,
): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: faker.string.uuid(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
}

// Update a product
export function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>,
): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return products[index];
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Generate sample products
export function generateSampleProducts(count = 50): Product[] {
  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
  ];

  const statuses: Product["status"][] = [
    "available",
    "out_of_stock",
    "discontinued",
  ];

  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    products.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: Number.parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      stock: faker.number.int({ min: 0, max: 500 }),
      status: faker.helpers.arrayElement(statuses),
      description: faker.commerce.productDescription(),
      sku: faker.string.alphanumeric({ length: 8, casing: "upper" }),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return products;
}

// Clear all products
export function clearProducts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
