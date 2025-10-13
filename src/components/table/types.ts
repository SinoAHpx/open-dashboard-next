export interface FilterOption {
  key: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
}

export interface TableStateSnapshot {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
}
