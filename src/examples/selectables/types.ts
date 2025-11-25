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

export type SelectableProductStatus = SelectableProduct["status"];
