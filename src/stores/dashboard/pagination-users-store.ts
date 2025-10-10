"use client";

import { createPaginationStore } from "./pagination-store";
import type { PaginationUser } from "@/lib/config/pagination-users.config";

export const usePaginationUsersStore = createPaginationStore<PaginationUser>();

