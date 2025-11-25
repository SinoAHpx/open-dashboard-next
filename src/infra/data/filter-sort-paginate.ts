import type { CrudFilters, CrudSorting } from "@refinedev/core";

/**
 * Extract filter values from CrudFilters into a simple map
 */
export function extractFilterMap(filters?: CrudFilters): Record<string, any> {
  const map: Record<string, any> = {};
  filters?.forEach((filter) => {
    if ("field" in filter && "value" in filter) {
      map[String(filter.field)] = filter.value;
    }
  });
  return map;
}

/**
 * Apply text search filter to data
 */
export function applySearch<T>(
  data: T[],
  query: string | undefined,
  searchFields: (keyof T)[],
): T[] {
  if (!query) return data;

  const q = query.toLowerCase();
  return data.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      return typeof value === "string" && value.toLowerCase().includes(q);
    }),
  );
}

/**
 * Apply exact match filters to data
 */
export function applyFilters<T>(
  data: T[],
  filterMap: Record<string, any>,
  excludeKeys: string[] = ["q"],
): T[] {
  let result = data;

  for (const [key, value] of Object.entries(filterMap)) {
    if (excludeKeys.includes(key) || value === undefined || value === "") {
      continue;
    }
    result = result.filter((item) => (item as any)[key] === value);
  }

  return result;
}

/**
 * Apply sorting to data
 */
export function applySort<T>(data: T[], sorters?: CrudSorting): T[] {
  const sorter = sorters?.[0];
  if (!sorter?.field) return data;

  const field = String(sorter.field) as keyof T;
  const direction = sorter.order === "desc" ? -1 : 1;

  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * direction;
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * direction;
    }

    return 0;
  });
}

/**
 * Apply pagination to data
 */
export function applyPagination<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
): { data: T[]; total: number } {
  const total = data.length;
  const start = (page - 1) * pageSize;
  const slice = data.slice(start, start + pageSize);

  return { data: slice, total };
}

/**
 * All-in-one: apply filters, sort, and paginate
 */
export function filterSortPaginate<T>(
  data: T[],
  options: {
    filters?: CrudFilters;
    sorters?: CrudSorting;
    pagination?: { current?: number; pageSize?: number };
    searchFields?: (keyof T)[];
  },
): { data: T[]; total: number } {
  const filterMap = extractFilterMap(options.filters);

  let result = data;

  // Apply search
  if (options.searchFields && filterMap.q) {
    result = applySearch(result, filterMap.q, options.searchFields);
  }

  // Apply exact filters
  result = applyFilters(result, filterMap);

  // Apply sort
  result = applySort(result, options.sorters);

  // Apply pagination
  return applyPagination(
    result,
    options.pagination?.current ?? 1,
    options.pagination?.pageSize ?? 10,
  );
}
