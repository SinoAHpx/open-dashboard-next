import type { ListParams, PaginatedResponse } from "@/lib/api-wrapper/resources";
import { fetchResourceList } from "@/lib/api-wrapper/resources";

export interface PetRecord {
  id: string;
  userId: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string | null;
  gender: "male" | "female" | "unknown";
  birthdate: string | null;
  ageText: string | null;
  weightKg: string | null;
  color: string | null;
  shoulderHeightClass: "small" | "large" | null;
  avatarUrl: string | null;
  neutered: boolean;
  vaccinated: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PetsResponse = PaginatedResponse<PetRecord>;

export async function getPets(params: ListParams = {}): Promise<PetsResponse> {
  return fetchResourceList<PetRecord>("pets", params);
}

