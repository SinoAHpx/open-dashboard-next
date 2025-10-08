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
  flexRender,
  type ColumnDef,
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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Initialize from URL on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const searchParam = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    if (pageParam) setPage(Number.parseInt(pageParam, 10));
    if (pageSizeParam) setPageSize(Number.parseInt(pageSizeParam, 10));
    if (searchParam) setSearch(searchParam);
    if (statusParam) setStatusFilter(statusParam);
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam) setSortOrder(sortOrderParam as "asc" | "desc");
  }, []);

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
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) {
      params.set("search", search);
    }
    if (statusFilter) {
      params.set("status", statusFilter);
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, search, statusFilter, sortBy, sortOrder, router]);

  // Fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPaginationUsers({
          page,
          pageSize,
          search,
          status: statusFilter,
          sortBy,
          sortOrder,
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
  }, [page, pageSize, search, statusFilter, sortBy, sortOrder]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10);
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      // Toggle sort order or clear
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortBy("");
        setSortOrder("asc");
      }
    } else {
      setSortBy(columnId);
      setSortOrder("asc");
    }
    setPage(1); // Reset to first page when sorting changes
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when search changes
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

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
          value={search}
          onValueChange={handleSearchChange}
          className="flex-1"
        />
        <Select
          size="md"
          placeholder="Filter by status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => handleStatusChange(e.target.value)}
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
                          className="flex items-center gap-2 cursor-pointer select-none"
                          onClick={() => handleSort(header.column.id)}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span className="text-gray-400">
                            {sortBy === header.column.id && sortOrder === "asc" ? (
                              <CaretUp size={16} weight="fill" />
                            ) : sortBy === header.column.id && sortOrder === "desc" ? (
                              <CaretDown size={16} weight="fill" />
                            ) : (
                              <div className="flex flex-col">
                                <CaretUp size={12} />
                                <CaretDown size={12} className="-mt-1" />
                              </div>
                            )}
                          </span>
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
