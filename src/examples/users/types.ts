export interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  role: string;
  department: string;
  joinDate: string;
}

export type UserStatus = User["status"];
