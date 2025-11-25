import type { CrudFilters, CrudSorting } from "@refinedev/core";

/**
 * Parameters for list operations (pagination, filters, sorters)
 */
export interface ListParams {
  pagination?: {
    current?: number;
    pageSize?: number;
  };
  filters?: CrudFilters;
  sorters?: CrudSorting;
}

/**
 * Standard paginated response shape
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

/**
 * Resource handlers that the data provider delegates to
 */
export interface ResourceHandlers<T = any> {
  list?: (params: ListParams) => Promise<PaginatedResponse<T>>;
  getOne?: (id: string) => Promise<{ data: T }>;
  create?: (variables: Partial<T>) => Promise<{ data: T }>;
  update?: (id: string, variables: Partial<T>) => Promise<{ data: T }>;
  deleteOne?: (id: string) => Promise<{ data: { id: string } }>;
}

/**
 * Configuration for creating a mock repository
 */
export interface MockRepositoryConfig<T> {
  /** localStorage key for persistence */
  storageKey: string;
  /** Function to generate seed data */
  seedData: () => T[];
  /** Fields to search when filtering by 'q' */
  searchFields: (keyof T)[];
  /** Function to get the ID from an entity */
  getId: (item: T) => string;
  /** Function to generate a new ID */
  generateId: () => string;
}
