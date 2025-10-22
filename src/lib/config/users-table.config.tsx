import { Avatar } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationRequest,
  type PaginationResponse,
  type PaginationTableConfig,
} from "@/lib/config/table-blueprint";
import { getUsers, type UserRecord } from "@/lib/api-wrapper/users";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

async function fetchUsers(
  params: PaginationRequest
): Promise<PaginationResponse<UserRecord>> {
  const { page, pageSize, search, sortBy, sortOrder, ...rest } = params;
  const filters = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== "")
  );

  const response = await getUsers({
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    filters,
  });

  return {
    data: response.data,
    pagination: {
      ...response.pagination,
      currentPage: response.pagination.page,
    },
  };
}

const columns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: "nickname",
    header: "Profile",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.avatarUrl ?? undefined}
            name={row.nickname ?? "Anonymous"}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="font-medium">
              {row.nickname ?? "Anonymous user"}
            </span>
            <span className="text-xs text-gray-500">{row.openId}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: (info) => info.getValue<string>() ?? "—",
  },
  {
    accessorKey: "pointsBalance",
    header: "Points",
    cell: (info) => info.getValue<number>().toLocaleString(),
  },
  {
    accessorKey: "membershipExpireAt",
    header: "Membership expires",
    cell: (info) => formatDate(info.getValue<string | null>()),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: (info) => formatDate(info.getValue<string>()),
  },
];

const usersTableConfig: PaginationTableConfig<UserRecord> = {
  columns,
  fetchData: fetchUsers,
  enableSearch: true,
  searchPlaceholder: "Search by nickname, phone, or open ID…",
  emptyMessage: "No users found",
  pageSizeOptions: [10, 20, 50],
  defaultPageSize: 10,
};

class UsersTableBlueprint extends PaginationTableBlueprint<UserRecord> {
  constructor() {
    super({
      title: "Users",
      description: "Customer accounts with membership and points context.",
    });
  }

  protected buildConfig(): PaginationTableConfig<UserRecord> {
    return usersTableConfig;
  }
}

export const usersTableBlueprint = new UsersTableBlueprint();
