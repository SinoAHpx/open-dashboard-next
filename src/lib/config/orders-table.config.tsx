import { Chip } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationRequest,
  type PaginationResponse,
  type PaginationTableConfig,
} from "@/lib/config/table-blueprint";
import { getOrders, type OrderRecord, type OrderStatus } from "@/lib/api-wrapper/orders";

function formatCurrency(value: string) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(numeric);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const statusColor: Record<OrderStatus, "primary" | "warning" | "success" | "danger" | "secondary"> = {
  pending: "primary",
  confirmed: "primary",
  processing: "warning",
  completed: "success",
  cancelled: "danger",
};

async function fetchOrders(
  params: PaginationRequest
): Promise<PaginationResponse<OrderRecord>> {
  const { page, pageSize, search, sortBy, sortOrder, ...rest } = params;
  const filters = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== "")
  );

  const response = await getOrders({
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

const columns: ColumnDef<OrderRecord>[] = [
  {
    accessorKey: "orderNo",
    header: "Order",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium">{info.getValue<string>()}</span>
        <span className="text-xs text-gray-500">User #{info.row.original.userId}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<OrderStatus>();
      return (
        <Chip size="sm" variant="flat" color={statusColor[status]}>
          {status}
        </Chip>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: (info) => formatCurrency(info.getValue<string>()),
  },
  {
    accessorKey: "discountAmount",
    header: "Discount",
    cell: (info) => formatCurrency(info.getValue<string>()),
  },
  {
    accessorKey: "payableAmount",
    header: "Payable",
    cell: (info) => formatCurrency(info.getValue<string>()),
  },
  {
    accessorKey: "appointmentAt",
    header: "Appointment",
    cell: (info) => formatDate(info.getValue<string | null>()),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (info) => formatDate(info.getValue<string>()),
  },
];

const ordersTableConfig: PaginationTableConfig<OrderRecord> = {
  columns,
  fetchData: fetchOrders,
  enableSearch: true,
  searchPlaceholder: "Search orders by number or status…",
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50],
  filters: [
    {
      key: "status",
      label: "Status",
      placeholder: "Filter by status",
      options: [
        { key: "pending", label: "Pending" },
        { key: "confirmed", label: "Confirmed" },
        { key: "processing", label: "Processing" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
      ],
    },
  ],
};

class OrdersTableBlueprint extends PaginationTableBlueprint<OrderRecord> {
  constructor() {
    super({
      title: "Orders",
      description: "Service order ledger with payment and scheduling info.",
    });
  }

  protected buildConfig(): PaginationTableConfig<OrderRecord> {
    return ordersTableConfig;
  }
}

export const ordersTableBlueprint = new OrdersTableBlueprint();

