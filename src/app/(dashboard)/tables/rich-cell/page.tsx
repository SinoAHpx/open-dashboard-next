"use client";

import { Button, Spinner, useDisclosure } from "@heroui/react";
import { Plus } from "@phosphor-icons/react";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import {
  PaginationTable,
  type PaginationTableRef,
} from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import type { RichCellTask } from "@/lib/api-wrapper/richcell";
import {
  createRichCellTasksConfig,
  richCellMeta,
} from "@/lib/config/richcells-tasks.config";

export default function RichCellPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { onOpen } = useDisclosure();

  const handleEdit = useCallback(
    (task: RichCellTask) => {
      console.log("Editing task:", task);
      onOpen();
    },
    [onOpen],
  );

  const handleDelete = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", id);
      tableRef.current?.refresh();
    }
  }, []);

  const handleAddTask = useCallback(() => {
    console.log("Adding new task");
    onOpen();
  }, [onOpen]);

  const [totalCount, setTotalCount] = useState(0);
  const config = useMemo(
    () =>
      createRichCellTasksConfig({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEdit],
  );

  return (
    <TablePage
      title={richCellMeta.title}
      description={`${richCellMeta.description ?? ""}${
        richCellMeta.description ? " " : ""
      }Total tasks: ${totalCount}`}
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
        <PaginationTable
          ref={tableRef}
          {...config}
          onTotalsChange={({ totalCount }) => setTotalCount(totalCount)}
        />
      </Suspense>
    </TablePage>
  );
}
