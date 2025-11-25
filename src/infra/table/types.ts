import type { BaseRecord, CrudFilters, CrudSort } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * Filter option for dropdowns
 */
export interface FilterOption {
  key: string;
  label: string;
}

/**
 * Configuration for a filter dropdown
 */
export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
}

/**
 * Selection change event payload
 */
export interface SelectionChangePayload<TData extends BaseRecord> {
  ids: string[];
  rows: TData[];
}

/**
 * Configuration for a paginated table
 */
export interface TableConfig<TData extends BaseRecord> {
  /** Resource name for refine */
  resource: string;
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Filter configurations */
  filters?: FilterConfig[];
  /** Page size options */
  pageSizeOptions?: number[];
  /** Default page size */
  defaultPageSize?: number;
  /** Enable search input */
  enableSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
  /** Function to extract row ID */
  getRowId?: (row: TData) => string;
}

/**
 * Props for the PaginationTable component
 */
export interface PaginationTableProps<TData extends BaseRecord>
  extends TableConfig<TData> {
  /** Permanent filters applied to all queries */
  permanentFilters?: CrudFilters;
  /** Permanent sorters applied to all queries */
  permanentSorters?: CrudSort[];
  /** Callback when totals change */
  onTotalsChange?: (payload: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }) => void;
  /** Enable row selection */
  enableSelection?: boolean;
  /** Callback when selection changes */
  onSelectionChange?: (payload: SelectionChangePayload<TData>) => void;
}

/**
 * Ref methods for PaginationTable
 */
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

/**
 * Metadata for a table page
 */
export interface TableMeta {
  title: string;
  description?: string;
}
