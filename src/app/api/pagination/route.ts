import { PaginationUser } from "@/lib/api-wrapper/pagination";
import { faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";

const TOTAL_RECORDS = 1000;
let cachedUsers: PaginationUser[] | null = null;

function generateUsers(): PaginationUser[] {
  if (cachedUsers) {
    return cachedUsers;
  }

  const users: PaginationUser[] = [];
  const statuses: Array<"active" | "pending" | "inactive"> = [
    "active",
    "pending",
    "inactive",
  ];

  for (let i = 1; i <= TOTAL_RECORDS; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      role: faker.person.jobTitle(),
      department: faker.commerce.department(),
      joinDate: faker.date.past({ years: 5 }).toISOString().split("T")[0],
    });
  }

  cachedUsers = users;
  return users;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";

    const allUsers = generateUsers();

    let filteredUsers = allUsers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower) ||
          user.department.toLowerCase().includes(searchLower)
      );
    }

    const totalCount = filteredUsers.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(offset, offset + pageSize);

    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Pagination API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
