import type { ListParams, PaginatedResponse } from "@/lib/api-wrapper/resources";
import { fetchResourceList } from "@/lib/api-wrapper/resources";

export interface StoreRecord {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  wechatId: string | null;
  businessHours: string | null;
  heroImageUrl: string | null;
  defaultDiscount: string | null;
  createdAt: string;
  updatedAt: string;
}

export type StoresResponse = PaginatedResponse<StoreRecord>;

export async function getStores(params: ListParams = {}): Promise<StoresResponse> {
  return fetchResourceList<StoreRecord>("stores", params);
}

