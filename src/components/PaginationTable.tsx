"use client";

import { Checkbox, Spinner } from "@heroui/react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
  type CrudFilter,
  type CrudFilters,
  type CrudSort,
  useTable,
} from "@refinedev/core";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { TablePaginationControls } from "@/components/table/TablePaginationControls";
import { TableToolbar } from "@/components/table/TableToolbar";
import type { FilterConfig } from "@/components/table/types";

export interface SelectionChangePayload<TData> {
  ids: string[];
  rows: TData[];
}

export interface PaginationTableConfig<TData> {
  resource: string;
  columns: ColumnDef<TData>[];
  filters?: FilterConfig[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  getRowId?: (row: TData) => string;
}

export interface PaginationTableProps<TData>
  extends PaginationTableConfig<TData> {
  permanentFilters?: CrudFilters;
  permanentSorters?: CrudSort[];
  onTotalsChange?: (payload: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }) => void;
  enableSelection?: boolean;
  onSelectionChange?: (payload: SelectionChangePayload<TData>) => void;
}

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

const getFilterValue = (filters: CrudFilter[], key: string) => {
  const match = filters.find(
    (filter) => "field" in filter && filter.field === key,
  );
  return (match?.value as string) ?? "";
};

const upsertFilter = (
  filters: CrudFilter[],
  key: string,
  value: string,
  operator: CrudFilter["operator"] = "eq",
): CrudFilter[] => {
  const withoutKey = filters.filter(
    (filter) => !("field" in filter && filter.field === key),
  );

  if (!value) {
    return withoutKey;
  }

  return [
    ...withoutKey,
    {
      field: key,
      operator,
      value,
    },
  ];
};

function PaginationTableInner<TData>(
  {
    resource,
    columns,
    filters = [],
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    defaultPageSize = 10,
    enableSearch = true,
    searchPlaceholder = "Search all columns...",
    emptyMessage = "No data found",
    className = "",
    getRowId,
    permanentFilters = [],
    permanentSorters = [],
    onTotalsChange,
    enableSelection = false,
    onSelectionChange,
  }: PaginationTableProps<TData>,
  ref: React.Ref<PaginationTableRef>,
) {
  const {
    tableQueryResult,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    sorters,
    setSorters,
    filters: activeFilters,
    setFilters,
  } = useTable<TData>({
    resource,
    pagination: {
      pageSize: defaultPageSize,
    },
    sorters: {
      permanent: permanentSorters ?? [],
    },
    filters: {
      permanent: permanentFilters ?? [],
    },
  });

  const data = tableQueryResult.data?.data ?? [];
  const totalCount = tableQueryResult.data?.total ?? 0;
  const isLoading = tableQueryResult.isLoading || tableQueryResult.isFetching;
  const totalPages =
    totalCount === 0 ? 0 : Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    onTotalsChange?.({
      totalCount,
      currentPage: current,
      pageSize,
    });
  }, [onTotalsChange, totalCount, current, pageSize]);

  const filterValues = useMemo(() => {
    const values: Record<string, string> = {};
    activeFilters.forEach((filter) => {
      if ("field" in filter && typeof filter.value === "string") {
        values[String(filter.field)] = filter.value;
      }
    });
    return values;
  }, [activeFilters]);

  const [searchValue, setSearchValue] = useState(filterValues.q ?? "");

  useEffect(() => {
    setSearchValue(filterValues.q ?? "");
  }, [filterValues.q]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      setFilters((previous) => upsertFilter(previous, "q", value, "contains"));
    },
    [setFilters],
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilters((previous) => upsertFilter(previous, key, value));
    },
    [setFilters],
  );

  const handleSortChange = useCallback(
    (columnId: string) => {
      setSorters((previous) => {
        const existing = previous?.[0];
        if (existing && existing.field === columnId) {
          return [
            {
              field: columnId,
              order: existing.order === "asc" ? "desc" : "asc",
            },
          ];
        }
        return [
          {
            field: columnId,
            order: "asc",
          },
        ];
      });
    },
    [setSorters],
  );

  const currentSorter = sorters?.[0];
  const sortBy = currentSorter?.field ? String(currentSorter.field) : "";
  const sortOrder = currentSorter?.order ?? "asc";

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
          row,
        );

        return JSON.stringify(row);
      }

      return String(candidate);
    },
    [getRowId],
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

      const selectedRows = data.filter((row) =>
        nextSelected.has(resolveRowId(row)),
      );

      onSelectionChange({
        ids: Array.from(nextSelected),
        rows: selectedRows,
      });
    },
    [data, isSelectable, onSelectionChange, resolveRowId],
  );

  const updateSelection = useCallback(
    (updater: (current: Set<string>) => Set<string>) => {
      if (!isSelectable) {
        return;
      }

      setSelectedKeys((previous) => updater(new Set(previous)));
    },
    [isSelectable],
  );

  useEffect(() => {
    setSelectedKeys((previous) => {
      const filtered = new Set<string>();

      previous.forEach((key) => {
        if (validRowIds.has(key)) {
          filtered.add(key);
        }
      });

      return filtered;
    });
  }, [validRowIds]);

  useEffect(() => {
    emitSelectionChange(selectedKeys);
  }, [emitSelectionChange, selectedKeys]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => {
        tableQueryResult.refetch();
      },
      resetPage: () => {
        setCurrent(1);
      },
      getTotalCount: () => totalCount,
      getCurrentPage: () => current,
      isLoading: () => isLoading,
      getSelectedKeys: () => new Set(selectedKeys),
      clearSelection: () => setSelectedKeys(new Set()),
      selectAll: () => {
        if (!isSelectable) {
          return;
        }
        setSelectedKeys(new Set(validRowIds));
      },
    }),
    [
      current,
      isLoading,
      isSelectable,
      selectedKeys,
      setCurrent,
      tableQueryResult,
      totalCount,
      validRowIds,
    ],
  );

  return (
    <div className={`flex flex-1 min-h-0 flex-col ${className}`}>
      <TableToolbar
        enableSearch={enableSearch}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onRefresh={() => tableQueryResult.refetch()}
        isLoading={isLoading}
      />

      <div className="relative flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {isSelectable ? (
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <Checkbox
                        isSelected={
                          selectedKeys.size > 0 &&
                          selectedKeys.size === validRowIds.size
                        }
                        isIndeterminate={
                          selectedKeys.size > 0 &&
                          selectedKeys.size < validRowIds.size
                        }
                        onValueChange={(value) => {
                          if (value) {
                            updateSelection(() => new Set(validRowIds));
                          } else {
                            updateSelection(() => new Set());
                          }
                        }}
                        aria-label="Select all rows"
                      />
                    </th>
                  ) : null}
                  {headerGroup.headers.map((header) => {
                    const columnId =
                      header.column.columnDef.id ??
                      (header.column.columnDef.accessorKey as string);
                    const isSorted = sortBy === columnId;
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        <button
                          className="flex items-center gap-1 text-left uppercase tracking-wider"
                          type="button"
                          onClick={() => handleSortChange(columnId)}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span className="inline-flex flex-col">
                            <CaretUp
                              weight="bold"
                              className={`-mb-1 h-3 w-3 ${
                                isSorted && sortOrder === "asc"
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            />
                            <CaretDown
                              weight="bold"
                              className={`h-3 w-3 ${
                                isSorted && sortOrder === "desc"
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            />
                          </span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
              {table.getRowModel().rows.map((row) => {
                const rowId = resolveRowId(row.original);
                const isSelected = selectedKeys.has(rowId);
                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    }`}
                  >
                    {isSelectable ? (
                      <td className="px-4 py-3">
                        <Checkbox
                          isSelected={isSelected}
                          onValueChange={(value) => {
                            if (value) {
                              updateSelection((previous) =>
                                new Set(previous).add(rowId),
                              );
                              return;
                            }
                            updateSelection((previous) => {
                              const next = new Set(previous);
                              next.delete(rowId);
                              return next;
                            });
                          }}
                          aria-label="Select row"
                        />
                      </td>
                    ) : null}
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <TablePaginationControls
        page={current}
        totalPages={totalPages}
        onPageChange={setCurrent}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrent(1);
        }}
      />
    </div>
  );
}

export const PaginationTable = forwardRef(PaginationTableInner) as <TData>(
  props: PaginationTableProps<TData> & {
    ref?: React.Ref<PaginationTableRef>;
  },
) => React.ReactElement;
