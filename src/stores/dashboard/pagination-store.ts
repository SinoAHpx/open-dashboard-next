"use client";

import { create, type StoreApi, type UseBoundStore } from "zustand";

export interface PaginationStoreState<TData> {
  data: TData[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  search: string;
  filterValues: Record<string, string>;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationStoreActions<TData> {
  mergeState: (partial: Partial<PaginationStoreState<TData>>) => void;
  updateState: (
    updater: (state: PaginationStoreState<TData>) => Partial<PaginationStoreState<TData>>
  ) => void;
  resetState: () => void;
}

export type PaginationStore<TData> = PaginationStoreState<TData> & PaginationStoreActions<TData>;

export type PaginationStoreHook<TData> = UseBoundStore<StoreApi<PaginationStore<TData>>>;

export const createDefaultPaginationState = <TData>(): PaginationStoreState<TData> => ({
  data: [],
  isLoading: true,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  totalCount: 0,
  search: "",
  filterValues: {},
  sortBy: "",
  sortOrder: "asc",
});

export const createPaginationStore = <TData>(
  initialState?: Partial<PaginationStoreState<TData>>
): PaginationStoreHook<TData> =>
  create<PaginationStore<TData>>((set) => ({
    ...createDefaultPaginationState<TData>(),
    ...initialState,
    mergeState: (partial) =>
      set((state) => ({
        ...state,
        ...partial,
      })),
    updateState: (updater) =>
      set((state) => {
        const baseState: PaginationStoreState<TData> = {
          data: [...state.data],
          isLoading: state.isLoading,
          page: state.page,
          pageSize: state.pageSize,
          totalPages: state.totalPages,
          totalCount: state.totalCount,
          search: state.search,
          filterValues: { ...state.filterValues },
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        };
        const partial = updater(baseState);

        return {
          ...state,
          ...partial,
        };
      }),
    resetState: () =>
      set((state) => ({
        ...state,
        ...createDefaultPaginationState<TData>(),
      })),
  }));

