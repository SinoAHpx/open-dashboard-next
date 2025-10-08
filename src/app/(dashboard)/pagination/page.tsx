"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Input,
} from "@heroui/react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { MagnifyingGlass, CaretUp, CaretDown } from "@phosphor-icons/react";
import {
  getPaginationUsers,
  type PaginationUser,
} from "@/lib/api-wrapper/pagination";

const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

export default function PaginationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? Number.parseInt(pageParam, 10) : 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? Number.parseInt(pageSizeParam, 15) : 15;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const statusColorMap: Record<
    PaginationUser["status"],
    "success" | "warning" | "danger"
  > = {
    active: "success",
    pending: "warning",
    inactive: "danger",
  };

  const columns = useMemo<ColumnDef<PaginationUser>[]>(
    () => [
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
        filterFn: "equals",
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
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    if (globalFilter) {
      params.set("search", globalFilter);
    }
    if (columnFilters.length > 0) {
      for (const filter of columnFilters) {
        params.set(filter.id, String(filter.value));
      }
    }
    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, globalFilter, columnFilters, sorting, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPaginationUsers({
          page,
          pageSize,
        });
        setData(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } catch (error) {
        console.error("Failed to load pagination users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10);
    setPageSize(newPageSize);
    setPage(1);
  };

  const statusFilter = columnFilters.find((f) => f.id === "status")?.value as
    | string
    | undefined;

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pagination Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Server-side pagination with TanStack Table and Hero UI. Total records:{" "}
          {totalCount}
        </p>
      </div>

      <div className="mb-4 flex shrink-0 items-center gap-4">
        <Input
          isClearable
          placeholder="Search all columns..."
          startContent={<MagnifyingGlass size={18} />}
          value={globalFilter}
          onValueChange={setGlobalFilter}
          className="flex-1"
        />
        <Select
          size="md"
          placeholder="Filter by status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              table.getColumn("status")?.setFilterValue(value);
            } else {
              table.getColumn("status")?.setFilterValue(undefined);
            }
          }}
          className="w-48"
          aria-label="Filter by status"
        >
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="inactive">Inactive</SelectItem>
        </Select>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/80 dark:bg-gray-800/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none"
                              : "flex items-center gap-2"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === "asc" ? (
                                <CaretUp size={16} weight="fill" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <CaretDown size={16} weight="fill" />
                              ) : (
                                <div className="flex flex-col">
                                  <CaretUp size={12} />
                                  <CaretDown size={12} className="-mt-1" />
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center">
                    <Spinner color="default" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-20 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </span>
          <Select
            size="sm"
            selectedKeys={[pageSize.toString()]}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-20"
            aria-label="Select page size"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
          color="primary"
        />
      </div>
    </div>
  );
}
