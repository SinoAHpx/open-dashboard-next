"use client";

import {
  Avatar,
  Button,
  Chip,
  Input,
  Progress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  PencilSimple,
  Trash,
  DotsThreeVertical,
  Check,
  X,
} from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PaginationTableBlueprint,
  type PaginationTableConfig,
  type PaginationRequest,
  type PaginationResponse,
} from "@/lib/config/table-blueprint";
import { useState } from "react";
import {
  getRichCellTasksMock,
  type RichCellTask,
} from "@/lib/api-wrapper/richcell";

// Adapter function to convert API response to generic format
async function fetchRichCellTasks(
  params: PaginationRequest
): Promise<PaginationResponse<RichCellTask>> {
  const response = await getRichCellTasksMock({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    status: params.status as string | undefined,
    priority: params.priority as string | undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return {
    data: response.data,
    pagination: {
      totalPages: response.pagination.totalPages,
      totalCount: response.pagination.totalCount,
      currentPage: response.pagination.page,
      pageSize: response.pagination.pageSize,
    },
  };
}

class RichCellTasksBlueprint extends PaginationTableBlueprint<
  RichCellTask,
  RichCellTasksContext
> {
  constructor() {
    super({
      title: "Rich Cell Table",
      description:
        "Advanced table with avatars, editable inputs, progress bars, and more interactive components.",
    });
  }

  protected buildConfig(
    context: RichCellTasksContext
  ): PaginationTableConfig<RichCellTask> {
    return createRichCellsConfig(context);
  }
}

export const richCellTasksBlueprint = new RichCellTasksBlueprint();

// Editable cell component
function EditableCell({
  initialValue,
  onSave,
}: {
  initialValue: string;
  onSave: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-[200px]"
          autoFocus
        />
        <Button
          isIconOnly
          size="sm"
          color="success"
          variant="flat"
          onPress={handleSave}
        >
          <Check size={16} weight="bold" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          color="danger"
          variant="flat"
          onPress={handleCancel}
        >
          <X size={16} weight="bold" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="font-medium">{value}</span>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onPress={() => setIsEditing(true)}
      >
        <PencilSimple size={14} weight="bold" />
      </Button>
    </div>
  );
}

export interface RichCellTasksContext {
  onEdit: (task: RichCellTask) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onUpdateTask: (id: string, field: string, value: string) => void;
}

// Factory function for creating config with actions
export function createRichCellsConfig(
  options: RichCellTasksContext
): PaginationTableConfig<RichCellTask> {
  const { onEdit, onDelete, onUpdateProgress, onUpdateTask } = options;

  // Status color mapping
  const statusColorMap: Record<
    RichCellTask["status"],
    "primary" | "success" | "warning" | "danger"
  > = {
    "in-progress": "primary",
    completed: "success",
    pending: "warning",
    blocked: "danger",
  };

  // Priority color mapping
  const priorityColorMap: Record<
    RichCellTask["priority"],
    "default" | "primary" | "warning" | "danger"
  > = {
    low: "default",
    medium: "primary",
    high: "warning",
    urgent: "danger",
  };

  const columns: ColumnDef<RichCellTask>[] = [
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: (info) => {
        const task = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar src={task.avatar} size="sm" name={task.assignee} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{task.assignee}</span>
              <span className="text-xs text-gray-500">{task.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Task Name",
      cell: (info) => {
        const task = info.row.original;
        return (
          <EditableCell
            initialValue={task.name}
            onSave={(value) => onUpdateTask(task.id, "name", value)}
          />
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: (info) => {
        const task = info.row.original;
        const progress = info.getValue() as number;

        return (
          <div className="flex flex-col gap-2 min-w-[150px]">
            <Progress
              value={progress}
              color={
                progress === 100
                  ? "success"
                  : progress >= 50
                  ? "primary"
                  : "warning"
              }
              size="sm"
              showValueLabel
              className="max-w-md"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() =>
                  onUpdateProgress(task.id, Math.min(100, progress + 10))
                }
                className="text-xs h-6"
              >
                +10%
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="default"
                onPress={() =>
                  onUpdateProgress(task.id, Math.max(0, progress - 10))
                }
                className="text-xs h-6"
              >
                -10%
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as RichCellTask["status"];
        return (
          <Chip color={statusColorMap[status]} size="sm" variant="flat">
            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
          </Chip>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: (info) => {
        const priority = info.getValue() as RichCellTask["priority"];
        return (
          <Chip color={priorityColorMap[priority]} size="sm" variant="dot">
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Chip>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: (info) => {
        const tags = info.getValue() as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Chip key={tag} size="sm" variant="bordered">
                {tag}
              </Chip>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (info) => {
        const task = info.row.original;
        return (
          <EditableCell
            initialValue={task.dueDate}
            onSave={(value) => onUpdateTask(task.id, "dueDate", value)}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const task = info.row.original;
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="edit"
                startContent={<PencilSimple size={18} />}
                onPress={() => onEdit(task)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                startContent={<Trash size={18} />}
                color="danger"
                onPress={() => onDelete(task.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  return {
    columns,
    fetchData: fetchRichCellTasks,
    filters: [
      {
        key: "status",
        label: "Status",
        placeholder: "Filter by status",
        options: [
          { key: "in-progress", label: "In Progress" },
          { key: "completed", label: "Completed" },
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
    pageSizeOptions: [5, 10, 15, 20, 25],
    defaultPageSize: 10,
    enableSearch: true,
    searchPlaceholder: "Search tasks, assignees, or emails...",
    emptyMessage: "No tasks found",
  };
}
