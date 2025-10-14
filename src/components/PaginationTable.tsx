"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import type { FilterConfig, TableStateSnapshot } from "@/components/table/types";
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

export interface SelectionChangePayload<TData> {
  ids: string[];
  rows: TData[];
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
  getRowId?: (row: TData) => string;
}

export interface PaginationTableProps<TData> extends PaginationTableConfig<TData> {
  store: PaginationStoreHook<TData>;
  onStateChange?: (snapshot: TableStateSnapshot) => void;
  enableSelection?: boolean;
  onSelectionChange?: (payload: SelectionChangePayload<TData>) => void;
}

export type { FilterConfig } from "@/components/table/types";

export interface PaginationTableRef {
  refresh: () => void;
  resetPage: () => void;
  getTotalCount: () => number;
  getCurrentPage: () => number;
  isLoading: () => boolean;
  getSelectedKeys: () => Set<string>;
  clearSelection: () => void;
  selectAll: () => void;
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
    onStateChange,
    enableSelection = false,
    getRowId,
    onSelectionChange,
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

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const isSelectable = enableSelection;

  const resolveRowId = useCallback(
    (row: TData): string => {
      if (getRowId) {
        return getRowId(row);
      }

      const candidate = (row as { id?: string | number | null | undefined }).id;

      if (candidate === undefined || candidate === null) {
        console.warn(
          "PaginationTable: getRowId was not provided and row is missing an id property. Falling back to JSON serialization, which may be unstable.",
          row
        );

        return JSON.stringify(row);
      }

      return String(candidate);
    },
    [getRowId]
  );

  const validRowIds = useMemo(() => {
    if (!isSelectable) {
      return new Set<string>();
    }

    return new Set(data.map((row) => resolveRowId(row)));
  }, [data, isSelectable, resolveRowId]);

  const emitSelectionChange = useCallback(
    (nextSelected: Set<string>) => {
      if (!isSelectable || !onSelectionChange) {
        return;
      }

      const selectedRows = data.filter((row) => nextSelected.has(resolveRowId(row)));

      onSelectionChange({
        ids: Array.from(nextSelected),
        rows: selectedRows,
      });
    },
    [data, isSelectable, onSelectionChange, resolveRowId]
  );

  const updateSelection = useCallback(
    (updater: (current: Set<string>) => Set<string>) => {
      if (!isSelectable) {
        return;
      }

      setSelectedKeys((previous) => updater(new Set(previous)));
    },
    [isSelectable]
  );

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
    if (!isSelectable) {
      return;
    }

    setSelectedKeys((previous) => {
      if (previous.size === 0) {
        return previous;
      }

      let changed = false;
      const next = new Set<string>();

      for (const id of previous) {
        if (validRowIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      }

      if (!changed) {
        return previous;
      }

      return next;
    });
  }, [isSelectable, validRowIds]);

  useEffect(() => {
    if (!isSelectable) {
      return;
    }

    emitSelectionChange(selectedKeys);
  }, [emitSelectionChange, isSelectable, selectedKeys]);

  useEffect(() => {
    if (isSelectable) {
      return;
    }

    setSelectedKeys((previous) => {
      if (previous.size === 0) {
        return previous;
      }
      return new Set();
    });
  }, [isSelectable]);

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

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!isSelectable) {
        return;
      }

      if (checked) {
        setSelectedKeys(new Set(validRowIds));
      } else {
        setSelectedKeys(new Set());
      }
    },
    [isSelectable, validRowIds]
  );

  const handleSelectRow = useCallback(
    (rowId: string, checked: boolean) => {
      if (!isSelectable) {
        return;
      }

      updateSelection((current) => {
        if (checked) {
          current.add(rowId);
        } else {
          current.delete(rowId);
        }
        return current;
      });
    },
    [isSelectable, updateSelection]
  );

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
      getSelectedKeys: () => new Set(selectedKeys),
      clearSelection: () => {
        if (!isSelectable) {
          return;
        }
        setSelectedKeys(new Set());
      },
      selectAll: () => {
        if (!isSelectable) {
          return;
        }
        setSelectedKeys(new Set(validRowIds));
      },
    }),
    [fetchAndUpdate, isSelectable, mergeState, selectedKeys, store, validRowIds]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  const isAllSelected =
    isSelectable && data.length > 0 && selectedKeys.size === data.length;
  const isSomeSelected =
    isSelectable && selectedKeys.size > 0 && selectedKeys.size < data.length;

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
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/80 dark:bg-gray-800/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {isSelectable ? (
                    <th className="px-4 py-3 w-12">
                      <Checkbox
                        isSelected={isAllSelected}
                        isIndeterminate={isSomeSelected}
                        onValueChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </th>
                  ) : null}
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
                  <td
                    colSpan={columns.length + (isSelectable ? 1 : 0)}
                    className="py-20 text-center"
                  >
                    <Spinner color="default" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (isSelectable ? 1 : 0)}
                    className="py-20 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const rowData = row.original as TData;
                  const rowId = resolveRowId(rowData);

                  return (
                    <tr
                      key={row.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {isSelectable ? (
                        <td className="px-4 py-3 w-12">
                          <Checkbox
                            isSelected={selectedKeys.has(rowId)}
                            onValueChange={(checked) => handleSelectRow(rowId, checked)}
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      ) : null}
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        onPageChange={(nextPage) => mergeState({ page: nextPage })}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(newPageSize) =>
          mergeState({ pageSize: newPageSize, page: 1 })
        }
      />
    </div>
  );
}

// Export with forwardRef for generic component
export const PaginationTable = forwardRef(PaginationTableInner) as <TData>(
  props: PaginationTableProps<TData> & { ref?: React.Ref<PaginationTableRef> }
) => ReturnType<typeof PaginationTableInner>;
