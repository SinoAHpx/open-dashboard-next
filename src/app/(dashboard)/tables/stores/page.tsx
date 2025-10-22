"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { PaginationTable } from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { storesTableBlueprint } from "@/lib/config/stores-table.config";

export default function StoresTablePage() {
  const { store, config, meta } = useMemo(() => storesTableBlueprint.createInstance(undefined), []);
  const totalCount = store((state) => state.totalCount);

  return (
    <TablePage
      title={meta.title}
      description={`${meta.description ?? ""}${
        meta.description ? " " : ""
      }Total records: ${totalCount}`}
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
