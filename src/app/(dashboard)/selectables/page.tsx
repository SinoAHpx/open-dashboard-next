"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import {
  SelectableTable,
  type SelectableTableRef,
} from "@/components/selectable-table";
import { FloatingActionMenu } from "@/components/floating-action-menu";
import {
  selectableProductsConfig,
  createFloatingActionsConfig,
} from "@/lib/config/selectable-products.config";
import { Spinner } from "@heroui/react";

export default function SelectablesPage() {
  const tableRef = useRef<SelectableTableRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Monitor selection changes
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedKeys = tableRef.current?.getSelectedKeys();
      const ids = selectedKeys ? Array.from(selectedKeys) : [];
      setSelectedIds(ids);
      setSelectedCount(ids.length);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClearSelection = () => {
    tableRef.current?.clearSelection();
  };

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  // Create actions config using the factory function
  const floatingActions = useMemo(
    () =>
      createFloatingActionsConfig({
        selectedIds,
        onClear: handleClearSelection,
        onRefresh: handleRefresh,
      }),
    [selectedIds]
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8 relative">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Selectable Products
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select multiple products to perform bulk operations. Total products:{" "}
          {tableRef.current?.getTotalCount() || 0}
        </p>
      </div>

      <Suspense fallback={<div className="flex items-center justify-center py-20"><Spinner /></div>}>
        <SelectableTable ref={tableRef} {...selectableProductsConfig} />
      </Suspense>

      <FloatingActionMenu
        selectedCount={selectedCount}
        onClear={handleClearSelection}
        actions={floatingActions}
      />
    </div>
  );
}
