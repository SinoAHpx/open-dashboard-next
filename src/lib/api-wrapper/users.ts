import type { PaginatedResponse, ListParams } from "@/lib/api-wrapper/resources";
import { fetchResourceList } from "@/lib/api-wrapper/resources";

export interface UserRecord {
  id: string;
  openId: string;
  unionId: string | null;
  phone: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  pointsBalance: number;
  currentMembershipLevelId: string | null;
  membershipExpireAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UsersResponse = PaginatedResponse<UserRecord>;

export async function getUsers(params: ListParams = {}): Promise<UsersResponse> {
  return fetchResourceList<UserRecord>("users", params);
}

