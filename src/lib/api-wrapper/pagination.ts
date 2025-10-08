export interface PaginationUser {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  role: string;
  department: string;
  joinDate: string;
}

export interface PaginationResponse {
  data: PaginationUser[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface GetPaginationUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getPaginationUsers(
  params: GetPaginationUsersParams = {}
): Promise<PaginationResponse> {
  const { page = 1, pageSize = 10, search = "" } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  const response = await fetch(`/api/pagination?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch pagination users");
  }

  const data: PaginationResponse = await response.json();
  return data;
}
