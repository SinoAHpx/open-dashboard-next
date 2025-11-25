import { faker } from "@faker-js/faker";
import { createMockRepository, type ResourceHandlers } from "@/infra/data";
import { generateTasks } from "./mock-data";
import type { Task } from "./types";

export const tasksHandlers: ResourceHandlers<Task> = createMockRepository<Task>(
  {
    storageKey: "example-tasks",
    seedData: () => generateTasks(100),
    searchFields: ["name", "assignee", "email"],
    getId: (task) => task.id,
    generateId: () => faker.string.uuid(),
  },
);
