import type {
  BaseRecord,
  CrudFilters,
  CrudSorting,
  DataProvider,
} from "@refinedev/core";
import {
  getPaginationUsers,
  type PaginationUser,
} from "@/lib/api-wrapper/pagination";
import {
  addProduct,
  deleteProduct,
  getPaginatedProducts,
  getProducts,
  type Product,
  updateProduct,
} from "@/lib/api-wrapper/products";
import {
  getRichCellTasksMock,
  type RichCellTask,
} from "@/lib/api-wrapper/richcell";
import {
  getSelectableProductsMock,
  type SelectableProduct,
} from "@/lib/api-wrapper/selectables";
import { getSimpleUsers } from "@/lib/api-wrapper/simple";

const buildFilterMap = (filters?: CrudFilters) => {
  const map: Record<string, any> = {};

  filters?.forEach((filter) => {
    if ("field" in filter && "operator" in filter) {
      map[String(filter.field)] = filter.value;
    }
  });

  return map;
};

const buildSorter = (sorters?: CrudSorting) => {
  const sorter = sorters?.[0];
  if (!sorter) return {};

  return {
    sortBy: String(sorter.field),
    sortOrder: sorter.order === "asc" ? "asc" : "desc",
  };
};

const notImplemented = (resource: string): never => {
  throw new Error(`Resource "${resource}" is not implemented in data provider`);
};

export const refineDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const filterMap = buildFilterMap(filters);
    const sorter = buildSorter(sorters);
    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    switch (resource) {
      case "products": {
        const response = getPaginatedProducts({
          page: current,
          pageSize,
          search: (filterMap.q as string) ?? "",
          status: (filterMap.status as string) ?? undefined,
          sortBy: sorter.sortBy,
          sortOrder: sorter.sortOrder as "asc" | "desc" | undefined,
        });

        return {
          data: response.data,
          total: response.pagination.totalCount,
        };
      }

      case "users": {
        const response = await getPaginationUsers({
          page: current,
          pageSize,
          search: (filterMap.q as string) ?? "",
          status: (filterMap.status as string) ?? undefined,
          sortBy: sorter.sortBy,
          sortOrder: sorter.sortOrder as "asc" | "desc" | undefined,
        });

        return {
          data: response.data,
          total: response.pagination.totalCount,
        };
      }

      case "simple-table": {
        const result = await getSimpleUsers();
        return {
          data: result,
          total: result.length,
        };
      }

      case "rich-cell": {
        const response = await getRichCellTasksMock({
          page: current,
          pageSize,
          search: (filterMap.q as string) ?? "",
          status: (filterMap.status as string) ?? "",
          priority: (filterMap.priority as string) ?? "",
          sortBy: sorter.sortBy,
          sortOrder: sorter.sortOrder as "asc" | "desc" | undefined,
        });

        return {
          data: response.data,
          total: response.pagination.totalCount,
        };
      }

      case "selectables": {
        const response = await getSelectableProductsMock({
          page: current,
          pageSize,
          search: (filterMap.q as string) ?? "",
          status: (filterMap.status as string) ?? "",
          category: (filterMap.category as string) ?? "",
          sortBy: sorter.sortBy,
          sortOrder: sorter.sortOrder as "asc" | "desc" | undefined,
        });

        return {
          data: response.data,
          total: response.pagination.totalCount,
        };
      }

      default:
        return notImplemented(resource);
    }
  },

  create: async ({ resource, variables }) => {
    switch (resource) {
      case "products": {
        const payload = variables as Omit<Product, "id" | "createdAt">;
        const product = addProduct(payload);
        return { data: product };
      }
      default:
        return notImplemented(resource);
    }
  },

  update: async ({ resource, id, variables }) => {
    switch (resource) {
      case "products": {
        const product = updateProduct(
          String(id),
          variables as Partial<Product>,
        );
        if (!product) {
          throw new Error("Product not found");
        }
        return { data: product };
      }
      default:
        return notImplemented(resource);
    }
  },

  deleteOne: async ({ resource, id }) => {
    switch (resource) {
      case "products": {
        const success = deleteProduct(String(id));
        if (!success) {
          throw new Error("Product not found");
        }
        return { data: { id } as BaseRecord };
      }
      default:
        return notImplemented(resource);
    }
  },

  getOne: async ({ resource, id }) => {
    switch (resource) {
      case "products": {
        const product = getProducts().find((item) => item.id === id);
        if (!product) {
          throw new Error("Product not found");
        }
        return { data: product };
      }

      default:
        return notImplemented(resource);
    }
  },

  // The following methods are required by the interface but are not used yet.
  getMany: async () => {
    throw new Error("getMany is not implemented");
  },
  getApiUrl: () => "",
  updateMany: async () => {
    throw new Error("updateMany is not implemented");
  },
  createMany: async () => {
    throw new Error("createMany is not implemented");
  },
  deleteMany: async () => {
    throw new Error("deleteMany is not implemented");
  },
  custom: async () => {
    throw new Error("custom is not implemented");
  },
};
