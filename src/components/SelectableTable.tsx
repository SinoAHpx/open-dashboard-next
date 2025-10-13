"use client";

import { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox, Spinner } from "@heroui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { TableToolbar } from "@/components/table/TableToolbar";
import { TablePaginationControls } from "@/components/table/TablePaginationControls";
import type {
  PaginationRequest,
  PaginationResponse,
} from "./PaginationTable";
import type { FilterConfig, TableStateSnapshot } from "./table/types";

export interface SelectableTableConfig<TData> {
  columns: ColumnDef<TData>[];
  fetchData: (params: PaginationRequest) => Promise<PaginationResponse<TData>>;
  filters?: FilterConfig[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  getRowId?: (row: TData) => string; // Function to get unique ID from row data
}

export interface SelectionChangePayload<TData> {
  ids: string[];
  rows: TData[];
}

export interface SelectableTableRef {
  refresh: () => void;
  resetPage: () => void;
  getTotalCount: () => number;
  getCurrentPage: () => number;
  isLoading: () => boolean;
  getSelectedKeys: () => Set<string>;
  clearSelection: () => void;
  selectAll: () => void;
}

export interface SelectableTableProps<TData>
  extends SelectableTableConfig<TData> {
  onStateChange?: (snapshot: TableStateSnapshot) => void;
  onSelectionChange?: (payload: SelectionChangePayload<TData>) => void;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50];

function SelectableTableInner<TData extends { id?: string }>(
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
    getRowId = (row) => (row as TData & { id: string }).id,
    onStateChange,
    onSelectionChange,
  }: SelectableTableProps<TData>,
  ref: React.Ref<SelectableTableRef>
) {
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

  // Selection state
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const emitSelectionChange = useCallback(
    (nextSelected: Set<string>) => {
      if (!onSelectionChange) {
        return;
      }

      const selectedRows = data.filter((row) =>
        nextSelected.has(getRowId(row))
      );

      onSelectionChange({
        ids: Array.from(nextSelected),
        rows: selectedRows,
      });
    },
    [data, getRowId, onSelectionChange]
  );

  const updateSelection = useCallback(
    (updater: (current: Set<string>) => Set<string>) => {
      setSelectedKeys((previous) => {
        const next = updater(new Set(previous));
        emitSelectionChange(next);
        return next;
      });
    },
    [emitSelectionChange]
  );

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
    getRowId: (row) => getRowId(row),
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

  useEffect(() => {
    onStateChange?.({
      page,
      pageSize,
      totalPages,
      totalCount,
      isLoading,
    });
  }, [isLoading, onStateChange, page, pageSize, totalCount, totalPages]);

  useEffect(() => {
    emitSelectionChange(selectedKeys);
  }, [emitSelectionChange, selectedKeys]);

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

  const handleRefresh = useCallback(async () => {
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
  }, [fetchData, filterValues, page, pageSize, search, sortBy, sortOrder]);

  // Fetch data on parameter change
  useEffect(() => {
    void handleRefresh();
  }, [handleRefresh]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map((row) => getRowId(row)));
      updateSelection(() => allIds);
    } else {
      updateSelection(() => new Set());
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    updateSelection((current) => {
      if (checked) {
        current.add(rowId);
      } else {
        current.delete(rowId);
      }
      return current;
    });
  };

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        void handleRefresh();
      },
      resetPage: () => setPage(1),
      getTotalCount: () => totalCount,
      getCurrentPage: () => page,
      isLoading: () => isLoading,
      getSelectedKeys: () => selectedKeys,
      clearSelection: () => {
        updateSelection(() => new Set());
      },
      selectAll: () => {
        const allIds = new Set(data.map((row) => getRowId(row)));
        updateSelection(() => allIds);
      },
    }),
    [data, getRowId, handleRefresh, isLoading, page, selectedKeys, totalCount, updateSelection]
  );

  const isAllSelected = data.length > 0 && selectedKeys.size === data.length;
  const isSomeSelected =
    selectedKeys.size > 0 && selectedKeys.size < data.length;

  return (
    <div className={`flex flex-1 min-h-0 flex-col ${className}`}>
      <TableToolbar
        enableSearch={enableSearch}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onRefresh={() => {
          void handleRefresh();
        }}
        isLoading={isLoading}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/80 dark:bg-gray-800/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <th className="px-4 py-3 w-12">
                    <Checkbox
                      isSelected={isAllSelected}
                      isIndeterminate={isSomeSelected}
                      onValueChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </th>
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
                            {sortBy === header.column.id &&
                            sortOrder === "asc" ? (
                              <CaretUp size={16} weight="fill" />
                            ) : sortBy === header.column.id &&
                              sortOrder === "desc" ? (
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
                  <td
                    colSpan={columns.length + 1}
                    className="py-20 text-center"
                  >
                    <Spinner color="default" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="py-20 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const rowId = getRowId(row.original);
                  const isSelected = selectedKeys.has(rowId);
                  return (
                    <tr
                      key={row.id}
                      className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        isSelected ? "bg-primary-50 dark:bg-primary-900/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 w-12">
                        <Checkbox
                          isSelected={isSelected}
                          onValueChange={(checked) =>
                            handleSelectRow(rowId, checked)
                          }
                          aria-label={`Select row ${rowId}`}
                        />
                      </td>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePaginationControls
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
    </div>
  );
}

// Export with forwardRef for generic component
export const SelectableTable = forwardRef(SelectableTableInner) as <
  TData extends { id?: string }
>(
  props: SelectableTableProps<TData> & { ref?: React.Ref<SelectableTableRef> }
) => ReturnType<typeof SelectableTableInner>;
