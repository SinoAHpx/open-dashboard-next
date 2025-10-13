import { createPaginationTableModule } from "@/modules/table-module";
import { createRichCellsConfig } from "@/lib/config/richcells-tasks.config";
import type { RichCellTask } from "@/lib/api-wrapper/richcell";

export interface RichCellTasksModuleContext {
  onEdit: (task: RichCellTask) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onUpdateTask: (id: string, field: string, value: string) => void;
}

export const richCellTasksModule = createPaginationTableModule<
  RichCellTask,
  RichCellTasksModuleContext
>({
  id: "richcell-tasks-table",
  meta: {
    title: "Rich Cell Table",
    description:
      "Advanced table with avatars, editable inputs, progress bars, and more interactive components.",
  },
  createConfig: (context) => createRichCellsConfig(context),
});
