import { createPaginationTableModule } from "@/modules/table-module";
import {
  paginationUsersConfig,
  type PaginationUser,
} from "@/lib/config/pagination-users.config";

export const paginationUsersModule = createPaginationTableModule<PaginationUser>(
  {
    id: "pagination-users-table",
    meta: {
      title: "Pagination Table",
      description:
        "Server-side pagination with TanStack Table and Hero UI.",
    },
    createConfig: () => paginationUsersConfig,
  }
);
