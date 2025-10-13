"use client";

import { Suspense, useMemo } from "react";
import { Spinner } from "@heroui/react";
import { PaginationTable } from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { paginationUsersModule } from "@/modules/tables/pagination-users.module";

export default function PaginationPage() {
  const { store, config } = useMemo(
    () => paginationUsersModule.createInstance(undefined),
    []
  );
  const totalCount = store((state) => state.totalCount);

  return (
    <TablePage
      title={paginationUsersModule.meta.title}
      description={`${paginationUsersModule.meta.description} Total records: ${totalCount}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable store={store} {...config} />
      </Suspense>
    </TablePage>
  );
}
