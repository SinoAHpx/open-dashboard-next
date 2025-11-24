import { Avatar, Button, Chip } from "@heroui/react";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  PaginationTableConfig,
  PaginationTableProps,
} from "@/components/PaginationTable";
import type { RichCellTask } from "@/lib/api-wrapper/richcell";

export const richCellMeta = {
  title: "Rich Cell Table",
  description: "Tasks table with avatars, progress, and tags.",
};

const statusColorMap: Record<
  RichCellTask["status"],
  "success" | "warning" | "secondary" | "danger"
> = {
  completed: "success",
  "in-progress": "warning",
  pending: "secondary",
  blocked: "danger",
};

export interface RichCellTableContext {
  onEdit: (task: RichCellTask) => void;
  onDelete: (id: string) => void;
}

const createColumns = (
  context?: RichCellTableContext,
): ColumnDef<RichCellTask>[] => [
  {
    accessorKey: "name",
    header: "Task",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {info.getValue() as string}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {info.row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm" src={info.row.original.avatar} />
        <span className="text-gray-700 dark:text-gray-300">
          {info.getValue() as string}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as RichCellTask["status"];
      return (
        <Chip color={statusColorMap[status]} variant="flat" size="sm">
          {status.replace("-", " ")}
        </Chip>
      );
    },
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
          onPress={() => context?.onEdit(info.row.original)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="light"
          color="danger"
          startContent={<Trash size={16} />}
          onPress={() => context?.onDelete(info.row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export const createRichCellTasksConfig = (
  context?: RichCellTableContext,
): PaginationTableConfig<RichCellTask> => ({
  resource: "rich-cell",
  columns: createColumns(context),
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
});

export type RichCellTableProps = PaginationTableProps<RichCellTask>;
