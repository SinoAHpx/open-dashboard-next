"use client";

import { createPaginationStore } from "./pagination-store";
import type { RichCellTask } from "@/lib/api-wrapper/richcell";

export const useRichCellTasksStore = createPaginationStore<RichCellTask>();

