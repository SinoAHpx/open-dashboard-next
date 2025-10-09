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
import type {
  PaginationTableConfig,
  PaginationRequest,
  PaginationResponse,
} from "@/components/pagination-table";
import { useState } from "react";

// Data type for rich cells
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

// Mock data generator
function generateMockTasks(count: number): RichCellTask[] {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Davis",
    "Diana Prince",
    "Eve Chen",
    "Frank Miller",
    "Grace Lee",
    "Henry Wilson",
  ];
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
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    name: `Task ${i + 1}: Implement feature ${i + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    email: names[i % names.length].toLowerCase().replace(" ", ".") + "@company.com",
    progress: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    assignee: names[i % names.length],
    dueDate: new Date(
      Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0],
    tags: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => tagOptions[Math.floor(Math.random() * tagOptions.length)]
    ).filter((v, i, a) => a.indexOf(v) === i),
  }));
}

// Generate mock data
const MOCK_TASKS = generateMockTasks(50);

// Fetch function with client-side pagination
async function fetchRichCellTasks(
  params: PaginationRequest
): Promise<PaginationResponse<RichCellTask>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...MOCK_TASKS];

  // Apply search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.assignee.toLowerCase().includes(searchLower) ||
        task.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply filters
  if (params.status) {
    filtered = filtered.filter((task) => task.status === params.status);
  }
  if (params.priority) {
    filtered = filtered.filter((task) => task.priority === params.priority);
  }

  // Apply sorting
  if (params.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[params.sortBy as keyof RichCellTask];
      const bVal = b[params.sortBy as keyof RichCellTask];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return params.sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return params.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  // Paginate
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      totalPages,
      totalCount,
      currentPage: params.page,
      pageSize: params.pageSize,
    },
  };
}

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

// Factory function for creating config with actions
export function createRichCellsConfig(options: {
  onEdit: (task: RichCellTask) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onUpdateTask: (id: string, field: string, value: string) => void;
}): PaginationTableConfig<RichCellTask> {
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
                onPress={() => onUpdateProgress(task.id, Math.min(100, progress + 10))}
                className="text-xs h-6"
              >
                +10%
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="default"
                onPress={() => onUpdateProgress(task.id, Math.max(0, progress - 10))}
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
