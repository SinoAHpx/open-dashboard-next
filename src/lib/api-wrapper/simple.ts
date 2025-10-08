export interface SimpleUser {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  role: string;
}

export async function getSimpleUsers(): Promise<SimpleUser[]> {
  const response = await fetch("/mocking/simple.json");
  if (!response.ok) {
    throw new Error("Failed to fetch simple users");
  }
  const data: SimpleUser[] = await response.json();
  return data;
}
