export interface SimpleUser {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  role: string;
}

export type SimpleUserStatus = SimpleUser["status"];
