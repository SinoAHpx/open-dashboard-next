import type { PaginationTableConfig } from "@/components/PaginationTable";
import type { FloatingAction } from "@/components/FloatingActionMenu";
import {
  createPaginationStore,
  type PaginationStoreHook,
  type PaginationStoreState,
} from "@/stores/dashboard/pagination-store";

export interface TableMeta {
  title: string;
  description?: string;
}

export abstract class PaginationTableBlueprint<TData, TContext = void> {
  constructor(
    public readonly meta: TableMeta,
    private readonly defaultState?: Partial<PaginationStoreState<TData>>
  ) {}

  protected createStore(): PaginationStoreHook<TData> {
    return createPaginationStore<TData>(this.defaultState);
  }

  protected abstract buildConfig(
    context: TContext
  ): PaginationTableConfig<TData>;

  createInstance(context: TContext) {
    const store = this.createStore();
    const config = this.buildConfig(context);

    return {
      store,
      config,
      meta: this.meta,
    };
  }
}

export abstract class SelectableTableBlueprint<
  TData,
  TConfigContext = void,
  TActionsContext = void,
> {
  constructor(
    public readonly meta: TableMeta,
    private readonly defaultState?: Partial<PaginationStoreState<TData>>
  ) {}

  protected createStore(): PaginationStoreHook<TData> {
    return createPaginationStore<TData>(this.defaultState);
  }

  protected abstract buildConfig(
    context: TConfigContext
  ): PaginationTableConfig<TData>;

  protected buildActions?(
    context: TActionsContext
  ): FloatingAction[];

  createInstance(context: TConfigContext) {
    const store = this.createStore();
    const config = this.buildConfig(context);

    return {
      store,
      config,
      meta: this.meta,
    };
  }

  createConfig(context: TConfigContext) {
    return this.buildConfig(context);
  }

  createActions(context: TActionsContext): FloatingAction[] {
    if (typeof this.buildActions === "function") {
      return this.buildActions(context);
    }
    return [];
  }
}

export type {
  PaginationRequest,
  PaginationResponse,
  PaginationTableConfig,
} from "@/components/PaginationTable";
export type { FloatingAction } from "@/components/FloatingActionMenu";
