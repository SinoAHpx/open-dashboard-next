/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { useRef, useCallback, useMemo, Suspense } from "react";
import {
  PaginationTable,
  type PaginationTableRef,
} from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { Button, useDisclosure, Spinner } from "@heroui/react";
import { Plus } from "@phosphor-icons/react";
import type { RichCellTask } from "@/lib/api-wrapper/richcell";
import { richCellTasksModule } from "@/modules/tables/richcell-tasks.module";

export default function RichCellPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { onOpen } = useDisclosure();

  const handleEdit = useCallback((task: RichCellTask) => {
    console.log("Editing task:", task);
    onOpen();
  }, [onOpen]);

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm("Are you sure you want to delete this task?")) {
        console.log("Deleting task:", id);
        tableRef.current?.refresh();
      }
    },
    [tableRef]
  );

  const handleUpdateProgress = useCallback(
    (id: string, progress: number) => {
      console.log(`Updating task ${id} progress to ${progress}%`);
      tableRef.current?.refresh();
    },
    [tableRef]
  );

  const handleUpdateTask = useCallback(
    (id: string, field: string, value: string) => {
      console.log(`Updating task ${id} field ${field} to ${value}`);
      tableRef.current?.refresh();
    },
    [tableRef]
  );

  const handleAddTask = useCallback(() => {
    console.log("Adding new task");
    onOpen();
  }, [onOpen]);

  const { store, config } = useMemo(
    () =>
      richCellTasksModule.createInstance({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onUpdateProgress: handleUpdateProgress,
        onUpdateTask: handleUpdateTask,
      }),
    [handleDelete, handleEdit, handleUpdateProgress, handleUpdateTask]
  );

  const totalCount = store((state) => state.totalCount);

  return (
    <TablePage
      title={richCellTasksModule.meta.title}
      description={`${richCellTasksModule.meta.description} Total tasks: ${totalCount}`}
      actions={
        <Button
          color="primary"
          startContent={<Plus size={18} weight="bold" />}
          onPress={handleAddTask}
        >
          Add Task
        </Button>
      }
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable ref={tableRef} store={store} {...config} />
      </Suspense>
    </TablePage>
  );
}
