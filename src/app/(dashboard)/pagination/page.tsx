"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import {
  PaginationTable,
  type PaginationTableRef,
} from "@/components/PaginationTable";
import { paginationUsersConfig } from "@/lib/config/pagination-users.config";
import { Spinner } from "@heroui/react";

export default function PaginationPage() {
  const tableRef = useRef<PaginationTableRef | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const handleTableRef = useCallback((instance: PaginationTableRef | null) => {
    tableRef.current = instance;

    const nextTotal = instance?.getTotalCount() ?? 0;
    setTotalCount((prev) => (prev === nextTotal ? prev : nextTotal));
  }, []);

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pagination Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Server-side pagination with TanStack Table and Hero UI. Total records:{" "}
          {totalCount}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable ref={handleTableRef} {...paginationUsersConfig} />
      </Suspense>
    </div>
  );
}
