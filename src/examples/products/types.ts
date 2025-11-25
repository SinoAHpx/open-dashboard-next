export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "available" | "out_of_stock" | "discontinued";
  description: string;
  sku: string;
  createdAt: string;
}

export type ProductStatus = Product["status"];
