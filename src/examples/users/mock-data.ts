import { faker } from "@faker-js/faker";
import type { User, UserStatus } from "./types";

const statuses: UserStatus[] = ["active", "pending", "inactive"];
const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Support",
  "HR",
  "Finance",
];
const roles = [
  "Developer",
  "Designer",
  "Manager",
  "Analyst",
  "Specialist",
  "Coordinator",
];

export function generateUser(id: number): User {
  return {
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(statuses),
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    joinDate: faker.date.past({ years: 3 }).toISOString().split("T")[0],
  };
}

export function generateUsers(count: number = 100): User[] {
  return Array.from({ length: count }, (_, i) => generateUser(i + 1));
}
