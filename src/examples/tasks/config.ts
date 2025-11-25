import type { TableConfig, TableMeta } from "@/infra/table";
import { createTasksColumns, type TasksTableContext } from "./columns";
import type { Task } from "./types";

export const tasksMeta: TableMeta = {
  title: "Rich Cell Table",
  description: "Tasks table with avatars, progress, and tags.",
};

export function createTasksConfig(
  context: TasksTableContext,
): TableConfig<Task> {
  return {
    resource: "tasks",
    columns: createTasksColumns(context),
    filters: [
      {
        key: "status",
        label: "Status",
        placeholder: "Filter by status",
        options: [
          { key: "completed", label: "Completed" },
          { key: "in-progress", label: "In Progress" },
          { key: "pending", label: "Pending" },
          { key: "blocked", label: "Blocked" },
        ],
      },
      {
        key: "priority",
        label: "Priority",
        placeholder: "Filter by priority",
        options: [
          { key: "low", label: "Low" },
          { key: "medium", label: "Medium" },
          { key: "high", label: "High" },
          { key: "urgent", label: "Urgent" },
        ],
      },
    ],
    pageSizeOptions: [5, 10, 15, 20],
    defaultPageSize: 10,
    enableSearch: true,
    searchPlaceholder: "Search tasks, assignees, or emails...",
    emptyMessage: "No tasks found",
  };
}
