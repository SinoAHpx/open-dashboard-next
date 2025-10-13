import type { PaginationTableConfig } from "@/components/PaginationTable";
import type { FilterConfig } from "@/components/table/types";
import type { SelectableTableConfig } from "@/components/SelectableTable";
import type { FloatingAction } from "@/components/FloatingActionMenu";
import {
  createPaginationStore,
  type PaginationStoreHook,
  type PaginationStoreState,
} from "@/stores/dashboard/pagination-store";

export interface TableModuleMeta {
  title: string;
  description?: string;
  filters?: FilterConfig[];
}

export interface PaginationTableModuleOptions<TData, TContext = void> {
  id: string;
  meta: TableModuleMeta;
  defaultState?: Partial<PaginationStoreState<TData>>;
  createConfig: (context: TContext) => PaginationTableConfig<TData>;
  createStore?: () => PaginationStoreHook<TData>;
}

export interface PaginationTableModule<TData, TContext = void> {
  id: string;
  meta: TableModuleMeta;
  createInstance: (
    context: TContext
  ) => {
    store: PaginationStoreHook<TData>;
    config: PaginationTableConfig<TData>;
  };
}

export function createPaginationTableModule<TData, TContext = void>({
  id,
  meta,
  defaultState,
  createConfig,
  createStore,
}: PaginationTableModuleOptions<TData, TContext>): PaginationTableModule<
  TData,
  TContext
> {
  return {
    id,
    meta,
    createInstance: (context: TContext) => {
      const storeFactory =
        createStore ??
        (() => createPaginationStore<TData>(defaultState));

      return {
        store: storeFactory(),
        config: createConfig(context),
      };
    },
  };
}

export interface SelectableTableModuleOptions<
  TData,
  TConfigContext = void,
  TActionsContext = void
> {
  id: string;
  meta: TableModuleMeta;
  createConfig: (context: TConfigContext) => SelectableTableConfig<TData>;
  createFloatingActions?: (
    context: TActionsContext
  ) => FloatingAction[];
}

export interface SelectableTableModule<
  TData,
  TConfigContext = void,
  TActionsContext = void
> {
  id: string;
  meta: TableModuleMeta;
  createInstance: (context: TConfigContext) => {
    config: SelectableTableConfig<TData>;
  };
  createFloatingActions?: (
    context: TActionsContext
  ) => FloatingAction[];
}

export function createSelectableTableModule<
  TData,
  TConfigContext = void,
  TActionsContext = void
>({
  id,
  meta,
  createConfig,
  createFloatingActions,
}: SelectableTableModuleOptions<
  TData,
  TConfigContext,
  TActionsContext
>): SelectableTableModule<TData, TConfigContext, TActionsContext> {
  return {
    id,
    meta,
    createInstance: (context: TConfigContext) => ({
      config: createConfig(context),
    }),
    createFloatingActions,
  };
}
