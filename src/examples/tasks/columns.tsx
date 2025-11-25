import { Avatar, Button, Chip } from "@heroui/react";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { type ChipColor, StatusChip } from "@/infra/ui";
import type { Task, TaskStatus } from "./types";

const statusColorMap: Record<TaskStatus, ChipColor> = {
  completed: "success",
  "in-progress": "warning",
  pending: "secondary",
  blocked: "danger",
};

export interface TasksTableContext {
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function createTasksColumns(
  context: TasksTableContext,
): ColumnDef<Task>[] {
  return [
    {
      accessorKey: "name",
      header: "Task",
      cell: (info) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {info.getValue() as string}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {info.row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: (info) => (
        <div className="flex items-center gap-2 min-w-0">
          <Avatar size="sm" src={info.row.original.avatar} className="shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 truncate">
            {info.getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <StatusChip
          status={info.getValue() as TaskStatus}
          colorMap={statusColorMap}
        />
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => (
        <Chip size="sm" variant="bordered">
          {info.getValue() as string}
        </Chip>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {(info.getValue() as string[]).map((tag) => (
            <Chip key={tag} size="sm" variant="flat">
              {tag}
            </Chip>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            startContent={<PencilSimple size={16} />}
            onPress={() => context.onEdit(info.row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="light"
            color="danger"
            startContent={<Trash size={16} />}
            onPress={() => context.onDelete(info.row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
}
