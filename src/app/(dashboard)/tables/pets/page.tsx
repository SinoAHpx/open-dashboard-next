"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { PaginationTable } from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { petsTableBlueprint } from "@/lib/config/pets-table.config";

export default function PetsTablePage() {
  const { store, config, meta } = useMemo(() => petsTableBlueprint.createInstance(undefined), []);
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
