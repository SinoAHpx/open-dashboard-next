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

const STORAGE_KEY = "selectableProducts";

// Generate a single mock product with Faker
function generateMockProduct(): SelectableProduct {
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

  const productName = faker.commerce.productName();
  const status = faker.helpers.arrayElement(statuses);

  return {
    id: faker.string.uuid(),
    name: productName,
    sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
    category: faker.helpers.arrayElement(categories),
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
}

// Generate multiple mock products
function generateMockProducts(count: number): SelectableProduct[] {
  return Array.from({ length: count }, () => generateMockProduct());
}

// Get products from localStorage
export function getProducts(): SelectableProduct[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with some default products
    const initialProducts = generateMockProducts(20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save products to localStorage
function saveProducts(products: SelectableProduct[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Add a new product
export function addProduct(
  product: Omit<SelectableProduct, "id" | "lastRestocked">
): SelectableProduct {
  const products = getProducts();
  const newProduct: SelectableProduct = {
    ...product,
    id: faker.string.uuid(),
    lastRestocked: new Date().toISOString().split("T")[0],
  };
  products.unshift(newProduct);
  saveProducts(products);
  return newProduct;
}

// Update an existing product
export function updateProduct(
  id: string,
  updates: Partial<Omit<SelectableProduct, "id">>
): SelectableProduct | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) return false;

  saveProducts(filtered);
  return true;
}

// Generate sample products
export function generateSampleProducts(count: number): void {
  const products = getProducts();
  const newProducts = generateMockProducts(count);
  saveProducts([...newProducts, ...products]);
}

// Get paginated products
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

  let filtered = [...getProducts()];

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

// Bulk operations
export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  console.log("Bulk deleting products:", ids);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const products = getProducts();
  const filtered = products.filter((p) => !ids.includes(p.id));
  saveProducts(filtered);
}

export async function bulkUpdateStatus(
  ids: string[],
  status: SelectableProduct["status"]
): Promise<void> {
  console.log("Bulk updating product status:", ids, status);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const products = getProducts();
  const updated = products.map((p) =>
    ids.includes(p.id) ? { ...p, status } : p
  );
  saveProducts(updated);
}

export async function bulkExportProducts(ids: string[]): Promise<void> {
  console.log("Bulk exporting products:", ids);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const products = getProducts();
  const toExport = products.filter((p) => ids.includes(p.id));

  // Create CSV content
  const headers = ["ID", "Name", "SKU", "Category", "Price", "Stock", "Status", "Supplier", "Last Restocked"];
  const rows = toExport.map((p) => [
    p.id,
    p.name,
    p.sku,
    p.category,
    p.price.toString(),
    p.stock.toString(),
    p.status,
    p.supplier,
    p.lastRestocked,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  // Download CSV file
  if (typeof window !== "undefined") {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
