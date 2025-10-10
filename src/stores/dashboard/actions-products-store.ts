"use client";

import { createPaginationStore } from "./pagination-store";
import type { Product } from "@/lib/api-wrapper/products";

export const useProductsPaginationStore = createPaginationStore<Product>();

