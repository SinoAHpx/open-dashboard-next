"use client";

import { useRef, useMemo } from "react";
import {
  PaginationTable,
  type PaginationTableRef,
} from "@/components/pagination-table";
import { createRichCellsConfig } from "@/lib/config/pagination-richcells.config";
import { type RichCellTask } from "@/lib/api-wrapper/richcell";
import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "@phosphor-icons/react";

export default function RichCellPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { onOpen } = useDisclosure();

  const handleEdit = (task: RichCellTask) => {
    console.log("Editing task:", task);
    // Here you would open a modal or form to edit the task
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", id);
      // Here you would call your API to delete the task
      tableRef.current?.refresh();
    }
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    console.log(`Updating task ${id} progress to ${progress}%`);
    // Here you would call your API to update the progress
    tableRef.current?.refresh();
  };

  const handleUpdateTask = (id: string, field: string, value: string) => {
    console.log(`Updating task ${id} field ${field} to ${value}`);
    // Here you would call your API to update the task
    tableRef.current?.refresh();
  };

  const handleAddTask = () => {
    console.log("Adding new task");
    // Here you would open a modal or form to add a new task
    onOpen();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const config = useMemo(
    () =>
      createRichCellsConfig({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onUpdateProgress: handleUpdateProgress,
        onUpdateTask: handleUpdateTask,
      }),
    []
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0 flex justify-between items-end  ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Rich Cell Table
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Advanced table with avatars, editable inputs, progress bars, and
            more interactive components. Total tasks:{" "}
            {tableRef.current?.getTotalCount() || 0}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} weight="bold" />}
          onPress={handleAddTask}
        >
          Add Task
        </Button>
      </div>

      <PaginationTable ref={tableRef} {...config} />
    </div>
  );
}
