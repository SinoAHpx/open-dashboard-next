import { faker } from "@faker-js/faker";
import type { Product, ProductStatus } from "./types";

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

const statuses: ProductStatus[] = ["available", "out_of_stock", "discontinued"];

export function generateProduct(): Product {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: Number.parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    stock: faker.number.int({ min: 0, max: 500 }),
    status: faker.helpers.arrayElement(statuses),
    description: faker.commerce.productDescription(),
    sku: faker.string.alphanumeric({ length: 8, casing: "upper" }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
  };
}

export function generateProducts(count: number = 50): Product[] {
  return Array.from({ length: count }, () => generateProduct());
}
