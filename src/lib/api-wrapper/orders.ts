import type { ListParams, PaginatedResponse } from "@/lib/api-wrapper/resources";
import { fetchResourceList } from "@/lib/api-wrapper/resources";

export type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled";

export interface OrderRecord {
  id: string;
  orderNo: string;
  userId: string;
  storeId: string | null;
  membershipLevelId: string | null;
  petId: string | null;
  status: OrderStatus;
  totalAmount: string;
  discountAmount: string;
  payableAmount: string;
  appointmentAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrdersResponse = PaginatedResponse<OrderRecord>;

export async function getOrders(params: ListParams = {}): Promise<OrdersResponse> {
  return fetchResourceList<OrderRecord>("orders", params);
}

