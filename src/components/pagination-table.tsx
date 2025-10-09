"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Input,
  Button,
} from "@heroui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { MagnifyingGlass, CaretUp, CaretDown, ArrowClockwise } from "@phosphor-icons/react";

// Generic types for pagination
export interface PaginationRequest {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | undefined; // For additional filters
}

export interface PaginationResponse<TData> {
  data: TData[];
  pagination: {
    totalPages: number;
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: Array<{
    key: string;
    label: string;
  }>;
}

export interface PaginationTableConfig<TData> {
  title: string;
  description: string;
  columns: ColumnDef<TData>[];
  fetchData: (params: PaginationRequest) => Promise<PaginationResponse<TData>>;
  filters?: FilterConfig[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50];

export function PaginationTable<TData>({
  title,
  description,
  columns,
  fetchData,
  filters = [],
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  defaultPageSize = 10,
  enableSearch = true,
  searchPlaceholder = "Search all columns...",
}: PaginationTableConfig<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Initialize from URL on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const searchParam = searchParams.get("search");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    if (pageParam) setPage(Number.parseInt(pageParam, 10));
    if (pageSizeParam) setPageSize(Number.parseInt(pageSizeParam, 10));
    if (searchParam) setSearch(searchParam);
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam) setSortOrder(sortOrderParam as "asc" | "desc");

    // Initialize filter values from URL
    const initialFilterValues: Record<string, string> = {};
    for (const filter of filters) {
      const filterParam = searchParams.get(filter.key);
      if (filterParam) {
        initialFilterValues[filter.key] = filterParam;
      }
    }
    setFilterValues(initialFilterValues);
  }, []);

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
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    // Add filter values to URL
    for (const [key, value] of Object.entries(filterValues)) {
      if (value) {
        params.set(key, value);
      }
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, search, filterValues, sortBy, sortOrder, router]);

  // Fetch data from server
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const requestParams: PaginationRequest = {
          page,
          pageSize,
          search,
          sortBy,
          sortOrder,
          ...filterValues,
        };
        const response = await fetchData(requestParams);
        setData(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, pageSize, search, filterValues, sortBy, sortOrder, fetchData]);

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

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page when filter changes
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const requestParams: PaginationRequest = {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
        ...filterValues,
      };
      const response = await fetchData(requestParams);
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {description} Total records: {totalCount}
        </p>
      </div>

      <div className="mb-4 flex shrink-0 items-center gap-4">
        {enableSearch && (
          <Input
            isClearable
            placeholder={searchPlaceholder}
            startContent={<MagnifyingGlass size={18} />}
            value={search}
            onValueChange={handleSearchChange}
            className="flex-1"
          />
        )}
        {filters.map((filter) => (
          <Select
            key={filter.key}
            size="md"
            placeholder={filter.placeholder}
            selectedKeys={filterValues[filter.key] ? [filterValues[filter.key]] : []}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-48"
            aria-label={filter.label}
          >
            {filter.options.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        ))}
        <Button
          isIconOnly
          variant="flat"
          onPress={handleRefresh}
          isLoading={isLoading}
          aria-label="Refresh"
        >
          <ArrowClockwise size={20} />
        </Button>
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
                    No data found
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
            {pageSizeOptions.map((option) => (
              <SelectItem key={option.toString()}>{option.toString()}</SelectItem>
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
