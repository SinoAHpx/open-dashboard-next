import { faker } from "@faker-js/faker";
import type { ResourceHandlers } from "@/infra/data";
import { createMockRepository } from "@/examples/_utils/create-mock-repository";
import { generateProducts } from "./mock-data";
import type { Product } from "./types";

export const productsHandlers: ResourceHandlers<Product> =
  createMockRepository<Product>({
    storageKey: "example-products",
    seedData: () => generateProducts(50),
    searchFields: ["name", "category", "sku", "description"],
    getId: (product) => product.id,
    generateId: () => faker.string.uuid(),
  });
