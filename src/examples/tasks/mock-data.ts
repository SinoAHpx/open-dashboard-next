import { faker } from "@faker-js/faker";
import type { Task, TaskPriority, TaskStatus } from "./types";

const statuses: TaskStatus[] = [
  "in-progress",
  "completed",
  "pending",
  "blocked",
];
const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];
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

export function generateTask(): Task {
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
      faker.number.int({ min: 1, max: 3 }),
    ),
  };
}

export function generateTasks(count: number = 100): Task[] {
  return Array.from({ length: count }, () => generateTask());
}
