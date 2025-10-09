"use client";

import { useRef } from "react";
import { PaginationTable, type PaginationTableRef } from "@/components/pagination-table";
import { paginationUsersConfig } from "@/lib/config/pagination-users.config";

export default function PaginationPage() {
  const tableRef = useRef<PaginationTableRef>(null);

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pagination Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Server-side pagination with TanStack Table and Hero UI. Total records:{" "}
          {tableRef.current?.getTotalCount() || 0}
        </p>
      </div>

      <PaginationTable ref={tableRef} {...paginationUsersConfig} />
    </div>
  );
}
