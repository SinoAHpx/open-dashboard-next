import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationTableConfig,
  type PaginationRequest,
  type PaginationResponse,
} from "@/lib/config/table-blueprint";
import {
  getPaginationUsers,
  type PaginationUser,
} from "@/lib/api-wrapper/pagination";

export type { PaginationUser };

// Adapter function to convert API response to generic format
async function fetchPaginationUsers(
  params: PaginationRequest
): Promise<PaginationResponse<PaginationUser>> {
  const response = await getPaginationUsers({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    status: params.status as string | undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return {
    data: response.data,
    pagination: {
      totalPages: response.pagination.totalPages,
      totalCount: response.pagination.totalCount,
      currentPage: response.pagination.page,
      pageSize: response.pagination.pageSize,
    },
  };
}

// Status color mapping
const statusColorMap: Record<
  PaginationUser["status"],
  "success" | "warning" | "danger"
> = {
  active: "success",
  pending: "warning",
  inactive: "danger",
};

// Column definitions
const columns: ColumnDef<PaginationUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as PaginationUser["status"];
      return (
        <Chip color={statusColorMap[status]} size="sm" variant="flat">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Chip>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">
        {info.getValue() as string}
      </span>
    ),
  },
];

// Export the configuration
export const paginationUsersConfig: PaginationTableConfig<PaginationUser> = {
  columns,
  fetchData: fetchPaginationUsers,
  filters: [
    {
      key: "status",
      label: "Filter by status",
      placeholder: "Filter by status",
      options: [
        { key: "active", label: "Active" },
        { key: "pending", label: "Pending" },
        { key: "inactive", label: "Inactive" },
      ],
    },
  ],
  pageSizeOptions: [5, 10, 15, 20, 25, 50],
  defaultPageSize: 10,
  enableSearch: true,
  searchPlaceholder: "Search all columns...",
  emptyMessage: "No users found",
};

class PaginationUsersBlueprint extends PaginationTableBlueprint<
  PaginationUser,
  void
> {
  constructor() {
    super({
      title: "Pagination Table",
      description: "Server-side pagination with TanStack Table and Hero UI.",
    });
  }

  protected buildConfig(): PaginationTableConfig<PaginationUser> {
    return paginationUsersConfig;
  }
}

export const paginationUsersBlueprint = new PaginationUsersBlueprint();
