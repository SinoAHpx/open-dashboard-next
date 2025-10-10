"use client";

import { useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, Select, SelectItem, Spinner, Input, Button } from "@heroui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { MagnifyingGlass, CaretUp, CaretDown, ArrowClockwise } from "@phosphor-icons/react";
import type {
  PaginationStoreHook,
  PaginationStoreState,
} from "@/stores/dashboard/pagination-store";

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
  columns: ColumnDef<TData>[];
  fetchData: (params: PaginationRequest) => Promise<PaginationResponse<TData>>;
  filters?: FilterConfig[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export interface PaginationTableProps<TData> extends PaginationTableConfig<TData> {
  store: PaginationStoreHook<TData>;
}

export interface PaginationTableRef {
  refresh: () => void;
  resetPage: () => void;
  getTotalCount: () => number;
  getCurrentPage: () => number;
  isLoading: () => boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50];

function PaginationTableInner<TData>(
  {
    columns,
    fetchData,
    filters = [],
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    defaultPageSize = 10,
    enableSearch = true,
    searchPlaceholder = "Search all columns...",
    emptyMessage = "No data found",
    className = "",
    store,
  }: PaginationTableProps<TData>,
  ref: React.Ref<PaginationTableRef>
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const data = store((state) => state.data);
  const isLoading = store((state) => state.isLoading);
  const page = store((state) => state.page);
  const pageSize = store((state) => state.pageSize);
  const totalPages = store((state) => state.totalPages);
  const totalCount = store((state) => state.totalCount);
  const search = store((state) => state.search);
  const filterValues = store((state) => state.filterValues);
  const sortBy = store((state) => state.sortBy);
  const sortOrder = store((state) => state.sortOrder);
  const mergeState = store((state) => state.mergeState);
  const updateState = store((state) => state.updateState);
  const resetState = store((state) => state.resetState);

  // Initialize from URL on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once per mount to hydrate initial state
  useEffect(() => {
    resetState();

    const updates: Partial<PaginationStoreState<TData>> = {
      pageSize: defaultPageSize,
    };

    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const searchParam = searchParams.get("search");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    if (pageParam) updates.page = Number.parseInt(pageParam, 10);
    if (pageSizeParam) updates.pageSize = Number.parseInt(pageSizeParam, 10);
    if (searchParam) updates.search = searchParam;
    if (sortByParam) updates.sortBy = sortByParam;
    if (sortOrderParam) updates.sortOrder = sortOrderParam as "asc" | "desc";

    const initialFilterValues: Record<string, string> = {};
    for (const filter of filters) {
      const filterParam = searchParams.get(filter.key);
      if (filterParam) {
        initialFilterValues[filter.key] = filterParam;
      }
    }

    if (Object.keys(initialFilterValues).length > 0) {
      updates.filterValues = initialFilterValues;
    }

    mergeState(updates);

    return () => {
      resetState();
    };
  }, []);

  const fetchAndUpdate = useCallback(async () => {
    const current = store.getState();
    mergeState({ isLoading: true });

    try {
      const requestParams: PaginationRequest = {
        page: current.page,
        pageSize: current.pageSize,
        search: current.search,
        sortBy: current.sortBy,
        sortOrder: current.sortOrder,
        ...current.filterValues,
      };

      const response = await fetchData(requestParams);

      mergeState({
        data: response.data,
        totalPages: response.pagination.totalPages,
        totalCount: response.pagination.totalCount,
        page: response.pagination.currentPage,
        pageSize: response.pagination.pageSize,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
      mergeState({ isLoading: false });
    }
  }, [fetchData, mergeState, store]);

  // Keep URL in sync with store state
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
    for (const [key, value] of Object.entries(filterValues)) {
      if (value) {
        params.set(key, value);
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filterValues, page, pageSize, router, search, sortBy, sortOrder]);

  // Trigger data fetching when state changes
  useEffect(() => {
    void fetchAndUpdate();
  }, [fetchAndUpdate, filterValues, page, pageSize, search, sortBy, sortOrder]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10);
    mergeState({ pageSize: newPageSize, page: 1 });
  };

  const handleSort = (columnId: string) => {
    updateState((current) => {
      if (current.sortBy === columnId) {
        if (current.sortOrder === "asc") {
          return {
            sortOrder: "desc",
            page: 1,
          };
        }

        return {
          sortBy: "",
          sortOrder: "asc",
          page: 1,
        };
      }

      return {
        sortBy: columnId,
        sortOrder: "asc",
        page: 1,
      };
    });
  };

  const handleSearchChange = (value: string) => {
    mergeState({ search: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateState((current) => ({
      filterValues: {
        ...current.filterValues,
        [key]: value,
      },
      page: 1,
    }));
  };

  const handleRefresh = useCallback(() => {
    void fetchAndUpdate();
  }, [fetchAndUpdate]);

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        void fetchAndUpdate();
      },
      resetPage: () => {
        mergeState({ page: 1 });
      },
      getTotalCount: () => store.getState().totalCount,
      getCurrentPage: () => store.getState().page,
      isLoading: () => store.getState().isLoading,
    }),
    [fetchAndUpdate, mergeState, store]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className={`flex flex-1 min-h-0 flex-col ${className}`}>
      <div className="mb-4 flex shrink-0 items-center gap-4 overflow-hidden">
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
                    {emptyMessage}
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex shrink-0 items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
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
          onChange={(nextPage) => mergeState({ page: nextPage })}
          showControls
          color="primary"
        />
      </div>
    </div>
  );
}

// Export with forwardRef for generic component
export const PaginationTable = forwardRef(PaginationTableInner) as <TData>(
  props: PaginationTableProps<TData> & { ref?: React.Ref<PaginationTableRef> }
) => ReturnType<typeof PaginationTableInner>;

