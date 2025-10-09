import { faker } from "@faker-js/faker";

export interface RichCellTask {
  id: string;
  name: string;
  avatar: string;
  email: string;
  progress: number;
  status: "in-progress" | "completed" | "pending" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  tags: string[];
}

export interface RichCellPaginationResponse {
  data: RichCellTask[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface GetRichCellTasksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Generate mock tasks with Faker
function generateMockTasks(count: number): RichCellTask[] {
  const statuses: RichCellTask["status"][] = [
    "in-progress",
    "completed",
    "pending",
    "blocked",
  ];
  const priorities: RichCellTask["priority"][] = [
    "low",
    "medium",
    "high",
    "urgent",
  ];
  const tagOptions = [
    "Frontend",
    "Backend",
    "Design",
    "Testing",
    "Urgent",
    "Bug",
    "Feature",
    "API",
    "Database",
    "UI/UX",
  ];

  return Array.from({ length: count }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        `Implement ${faker.hacker.noun()} feature`,
        `Fix ${faker.hacker.noun()} bug`,
        `Optimize ${faker.hacker.verb()} performance`,
        `Design ${faker.hacker.noun()} interface`,
        `Test ${faker.hacker.verb()} functionality`,
        `Refactor ${faker.hacker.noun()} code`,
      ]),
      avatar: faker.image.avatar(),
      email: faker.internet.email({ firstName, lastName }),
      progress: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(statuses),
      priority: faker.helpers.arrayElement(priorities),
      assignee: fullName,
      dueDate: faker.date
        .between({
          from: new Date(),
          to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        })
        .toISOString()
        .split("T")[0],
      tags: faker.helpers.arrayElements(
        tagOptions,
        faker.number.int({ min: 1, max: 3 })
      ),
    };
  });
}

// Cache for mock data
let cachedTasks: RichCellTask[] | null = null;

function getMockTasks(): RichCellTask[] {
  if (!cachedTasks) {
    cachedTasks = generateMockTasks(100);
  }
  return cachedTasks;
}

export async function getRichCellTasks(
  params: GetRichCellTasksParams = {}
): Promise<RichCellPaginationResponse> {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    status = "",
    priority = "",
    sortBy = "",
    sortOrder = "asc",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    queryParams.append("search", search);
  }

  if (status) {
    queryParams.append("status", status);
  }

  if (priority) {
    queryParams.append("priority", priority);
  }

  if (sortBy) {
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);
  }

  const response = await fetch(`/api/richcell?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch rich cell tasks");
  }

  const data: RichCellPaginationResponse = await response.json();
  return data;
}

// Client-side mock function (for development without backend)
export async function getRichCellTasksMock(
  params: GetRichCellTasksParams = {}
): Promise<RichCellPaginationResponse> {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    status = "",
    priority = "",
    sortBy = "",
    sortOrder = "asc",
  } = params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...getMockTasks()];

  // Apply search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.assignee.toLowerCase().includes(searchLower) ||
        task.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply filters
  if (status) {
    filtered = filtered.filter((task) => task.status === status);
  }
  if (priority) {
    filtered = filtered.filter((task) => task.priority === priority);
  }

  // Apply sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof RichCellTask];
      const bVal = b[sortBy as keyof RichCellTask];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  // Paginate
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}
