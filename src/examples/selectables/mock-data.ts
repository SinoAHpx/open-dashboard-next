import { faker } from "@faker-js/faker";
import type { SelectableProduct, SelectableProductStatus } from "./types";

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

const statuses: SelectableProductStatus[] = [
  "active",
  "out-of-stock",
  "discontinued",
];

export function generateSelectableProduct(): SelectableProduct {
  const status = faker.helpers.arrayElement(statuses);

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
    category: faker.helpers.arrayElement(categories),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
    stock:
      status === "out-of-stock" ? 0 : faker.number.int({ min: 0, max: 500 }),
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

export function generateSelectableProducts(
  count: number = 50,
): SelectableProduct[] {
  return Array.from({ length: count }, () => generateSelectableProduct());
}
