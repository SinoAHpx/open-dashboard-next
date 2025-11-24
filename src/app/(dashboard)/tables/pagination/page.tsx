"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useState } from "react";
import { PaginationTable } from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import {
  paginationUsersConfig,
  paginationUsersMeta,
} from "@/lib/config/pagination-users.config";

export default function PaginationPage() {
  const [totalCount, setTotalCount] = useState(0);

  return (
    <TablePage
      title={paginationUsersMeta.title}
      description={`${paginationUsersMeta.description ?? ""}${
        paginationUsersMeta.description ? " " : ""
      }Total records: ${totalCount}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable
          {...paginationUsersConfig}
          onTotalsChange={({ totalCount }) => setTotalCount(totalCount)}
        />
      </Suspense>
    </TablePage>
  );
}
