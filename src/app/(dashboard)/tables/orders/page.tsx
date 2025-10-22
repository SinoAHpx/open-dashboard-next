"use client";

import { Spinner } from "@heroui/react";
import { Suspense, useMemo } from "react";
import { PaginationTable } from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import { ordersTableBlueprint } from "@/lib/config/orders-table.config";

export default function OrdersTablePage() {
  const { store, config, meta } = useMemo(() => ordersTableBlueprint.createInstance(undefined), []);
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
