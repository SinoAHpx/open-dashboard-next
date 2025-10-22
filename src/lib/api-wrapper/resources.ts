import type { ResourceKey } from "@/server/resources";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResponse<TData> {
  data: TData[];
  pagination: PaginationMeta;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<
    string,
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean | null | undefined>
  >;
}

function buildQuery(params: ListParams = {}): string {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const entry of value) {
          if (entry === undefined || entry === null) continue;
          query.append(key, String(entry));
        }
        continue;
      }

      if (value === null) {
        query.append(key, "null");
      } else {
        query.append(key, String(value));
      }
    }
  }

  return query.toString();
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const res = await fetch(path.startsWith("/api") ? path : `/api/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed for ${path}`);
  }

  return res.json() as Promise<TResponse>;
}

export async function fetchResourceList<TData>(
  resource: ResourceKey,
  params: ListParams = {}
): Promise<PaginatedResponse<TData>> {
  const query = buildQuery(params);
  const res = await fetch(`/api/${resource}?${query}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Failed to fetch ${resource}`);
  }

  return (await res.json()) as PaginatedResponse<TData>;
}

export async function fetchResourceItem<TData>(
  resource: ResourceKey,
  id: string | number
): Promise<TData> {
  return request<TData>(`/api/${resource}/${id}`, {
    method: "GET",
  });
}

export async function createResource<TData, TResult = TData>(
  resource: ResourceKey,
  data: TData
): Promise<TResult> {
  return request<TResult>(`/api/${resource}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateResource<TData, TResult = TData>(
  resource: ResourceKey,
  id: string | number,
  data: Partial<TData>
): Promise<TResult> {
  return request<TResult>(`/api/${resource}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteResource(
  resource: ResourceKey,
  id: string | number
): Promise<void> {
  await request(`/api/${resource}/${id}`, {
    method: "DELETE",
  });
}
