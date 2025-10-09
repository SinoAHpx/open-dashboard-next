"use client";

import { useRef, useEffect, useState } from "react";
import {
  SelectableTable,
  type SelectableTableRef,
} from "@/components/selectable-table";
import { selectableProductsConfig } from "@/lib/config/selectable-products.config";
import { Button, Card, CardBody } from "@heroui/react";
import {
  Trash,
  Export,
  CheckCircle,
  XCircle,
  Package,
} from "@phosphor-icons/react";
import {
  bulkDeleteProducts,
  bulkUpdateStatus,
  bulkExportProducts,
} from "@/lib/api-wrapper/selectables";

export default function SelectablesPage() {
  const tableRef = useRef<SelectableTableRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Monitor selection changes
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedKeys = tableRef.current?.getSelectedKeys();
      const count = selectedKeys?.size || 0;
      setSelectedCount(count);
      setShowFloatingMenu(count > 0);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBulkDelete = async () => {
    const selectedKeys = tableRef.current?.getSelectedKeys();
    if (!selectedKeys || selectedKeys.size === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedKeys.size} product(s)?`
      )
    ) {
      try {
        await bulkDeleteProducts(Array.from(selectedKeys));
        tableRef.current?.clearSelection();
        tableRef.current?.refresh();
      } catch (error) {
        console.error("Failed to delete products:", error);
      }
    }
  };

  const handleBulkMarkActive = async () => {
    const selectedKeys = tableRef.current?.getSelectedKeys();
    if (!selectedKeys || selectedKeys.size === 0) return;

    try {
      await bulkUpdateStatus(Array.from(selectedKeys), "active");
      tableRef.current?.clearSelection();
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleBulkMarkOutOfStock = async () => {
    const selectedKeys = tableRef.current?.getSelectedKeys();
    if (!selectedKeys || selectedKeys.size === 0) return;

    try {
      await bulkUpdateStatus(Array.from(selectedKeys), "out-of-stock");
      tableRef.current?.clearSelection();
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleBulkMarkDiscontinued = async () => {
    const selectedKeys = tableRef.current?.getSelectedKeys();
    if (!selectedKeys || selectedKeys.size === 0) return;

    try {
      await bulkUpdateStatus(Array.from(selectedKeys), "discontinued");
      tableRef.current?.clearSelection();
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleBulkExport = async () => {
    const selectedKeys = tableRef.current?.getSelectedKeys();
    if (!selectedKeys || selectedKeys.size === 0) return;

    try {
      await bulkExportProducts(Array.from(selectedKeys));
    } catch (error) {
      console.error("Failed to export products:", error);
    }
  };

  const handleClearSelection = () => {
    tableRef.current?.clearSelection();
  };

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

      <SelectableTable ref={tableRef} {...selectableProductsConfig} />

      {/* Floating Action Menu */}
      {showFloatingMenu && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Card
            shadow="lg"
            className="border border-gray-200 dark:border-gray-700"
          >
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className="flex items-center gap-2 px-4 border-r border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium">
                  {selectedCount} selected
                </span>
                <Button
                  size="sm"
                  variant="light"
                  onPress={handleClearSelection}
                  className="min-w-unit-16"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  startContent={<CheckCircle size={18} weight="bold" />}
                  onPress={handleBulkMarkActive}
                >
                  Mark Active
                </Button>

                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  startContent={<Package size={18} weight="bold" />}
                  onPress={handleBulkMarkOutOfStock}
                >
                  Out of Stock
                </Button>

                <Button
                  size="sm"
                  color="default"
                  variant="flat"
                  startContent={<XCircle size={18} weight="bold" />}
                  onPress={handleBulkMarkDiscontinued}
                >
                  Discontinue
                </Button>

                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<Export size={18} weight="bold" />}
                  onPress={handleBulkExport}
                >
                  Export
                </Button>

                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  startContent={<Trash size={18} weight="bold" />}
                  onPress={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
