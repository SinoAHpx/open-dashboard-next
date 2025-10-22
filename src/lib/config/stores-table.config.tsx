import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationRequest,
  type PaginationResponse,
  type PaginationTableConfig,
} from "@/lib/config/table-blueprint";
import { getStores, type StoreRecord } from "@/lib/api-wrapper/stores";

function formatCoordinate(value: string | null) {
  if (!value) return "—";
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return value;
  return parsed.toFixed(5);
}

async function fetchStores(
  params: PaginationRequest
): Promise<PaginationResponse<StoreRecord>> {
  const { page, pageSize, search, sortBy, sortOrder, ...rest } = params;
  const filters = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== "")
  );

  const response = await getStores({
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

const columns: ColumnDef<StoreRecord>[] = [
  {
    accessorKey: "name",
    header: "Store",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.name}</span>
          <span className="text-xs text-gray-500">{row.slug ?? "—"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex flex-col">
          <span>{row.city ?? "—"}</span>
          <span className="text-xs text-gray-500">
            {row.province ?? "—"}
          </span>
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
    accessorKey: "wechatId",
    header: "WeChat",
    cell: (info) => info.getValue<string>() ?? "—",
  },
  {
    accessorKey: "businessHours",
    header: "Business Hours",
    cell: (info) => info.getValue<string>() ?? "—",
  },
  {
    accessorKey: "defaultDiscount",
    header: "Promotion",
    cell: (info) => {
      const value = info.getValue<string | null>();
      if (!value) return "—";
      return (
        <Chip size="sm" variant="flat" color="success">
          {value}
        </Chip>
      );
    },
  },
  {
    accessorKey: "latitude",
    header: "Latitude",
    cell: (info) => formatCoordinate(info.getValue<string | null>()),
  },
  {
    accessorKey: "longitude",
    header: "Longitude",
    cell: (info) => formatCoordinate(info.getValue<string | null>()),
  },
];

const storesTableConfig: PaginationTableConfig<StoreRecord> = {
  columns,
  fetchData: fetchStores,
  enableSearch: true,
  searchPlaceholder: "Search stores by name, slug, or city…",
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50],
};

class StoresTableBlueprint extends PaginationTableBlueprint<StoreRecord> {
  constructor() {
    super({
      title: "Stores",
      description: "Physical store directory with contact and location data.",
    });
  }

  protected buildConfig(): PaginationTableConfig<StoreRecord> {
    return storesTableConfig;
  }
}

export const storesTableBlueprint = new StoresTableBlueprint();

