import type { DataProvider } from "@refinedev/core";
import { getResourceHandlers } from "./resource-registry";

const notImplemented = (resource: string, method: string): never => {
  throw new Error(
    `Resource "${resource}" does not implement "${method}". ` +
      `Make sure to register handlers via registerResource().`,
  );
};

/**
 * Refine DataProvider that delegates all operations to the resource registry.
 * Each resource (example or feature) registers its own handlers.
 */
export const refineDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const handlers = getResourceHandlers(resource);
    if (!handlers?.list) return notImplemented(resource, "getList");

    return handlers.list({
      pagination: {
        current: pagination?.currentPage,
        pageSize: pagination?.pageSize,
      },
      filters,
      sorters,
    });
  },

  getOne: async ({ resource, id }) => {
    const handlers = getResourceHandlers(resource);
    if (!handlers?.getOne) return notImplemented(resource, "getOne");
    return handlers.getOne(String(id));
  },

  create: async ({ resource, variables }) => {
    const handlers = getResourceHandlers(resource);
    if (!handlers?.create) return notImplemented(resource, "create");
    return handlers.create(variables as any);
  },

  update: async ({ resource, id, variables }) => {
    const handlers = getResourceHandlers(resource);
    if (!handlers?.update) return notImplemented(resource, "update");
    return handlers.update(String(id), variables as any);
  },

  deleteOne: async ({ resource, id }): Promise<any> => {
    const handlers = getResourceHandlers(resource);
    if (!handlers?.deleteOne) return notImplemented(resource, "deleteOne");
    return handlers.deleteOne(String(id));
  },

  // Not implemented - add as needed
  getMany: async () => {
    throw new Error("getMany is not implemented");
  },
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
  getApiUrl: () => "",
};
