"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowClockwise,
  PencilSimple,
  Plus,
  Sparkle,
} from "@phosphor-icons/react";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import {
  generateSelectableProducts,
  type SelectableProduct,
  selectablesConfig,
  selectablesHandlers,
  selectablesMeta,
} from "@/examples/selectables";
import {
  PaginationTable,
  type PaginationTableRef,
  type SelectionChangePayload,
  TablePage,
} from "@/infra/table";

type ProductFormData = Omit<SelectableProduct, "id" | "lastRestocked">;

export default function SelectablesPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editingProduct, setEditingProduct] =
    useState<SelectableProduct | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    price: 0,
    stock: 0,
    status: "active",
    supplier: "",
  });

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      status: "active",
      supplier: "",
    });
    onOpen();
  }, [onOpen]);

  const handleEdit = useCallback(
    (product: SelectableProduct) => {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.status,
        supplier: product.supplier,
      });
      onOpen();
    },
    [onOpen],
  );

  const handleSubmit = useCallback(async () => {
    if (editingProduct) {
      await selectablesHandlers.update?.(editingProduct.id, formData);
    } else {
      await selectablesHandlers.create?.(formData);
    }
    onClose();
    tableRef.current?.refresh();
  }, [editingProduct, formData, onClose]);

  const handleFormChange = useCallback(
    (field: keyof ProductFormData, value: string | number) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    [],
  );

  const handleGenerateSamples = useCallback(() => {
    const products = generateSelectableProducts(50);
    const existing = JSON.parse(
      localStorage.getItem("example-selectables") || "[]",
    );
    localStorage.setItem(
      "example-selectables",
      JSON.stringify([...products, ...existing]),
    );
    tableRef.current?.refresh();
  }, []);

  const handleClearSelection = useCallback(() => {
    tableRef.current?.clearSelection();
  }, []);

  const handleRefresh = useCallback(() => {
    tableRef.current?.refresh();
  }, []);

  const handleSelectionChange = useCallback(
    (payload: SelectionChangePayload<SelectableProduct>) => {
      setSelectedIds(payload.ids);
      setSelectedCount(payload.ids.length);
    },
    [],
  );

  const handleEditSelected = useCallback(
    async (id: string) => {
      const result = await selectablesHandlers.getOne?.(id);
      if (result?.data) {
        handleEdit(result.data);
      }
    },
    [handleEdit],
  );

  const floatingActions = useMemo(
    () => [
      {
        key: "edit-first",
        label: "Edit First",
        icon: <PencilSimple size={16} />,
        color: "primary" as const,
        onClick: () => {
          if (selectedIds.length > 0) {
            handleEditSelected(selectedIds[0]);
          }
        },
      },
      {
        key: "refresh",
        label: "Refresh",
        icon: <ArrowClockwise size={16} />,
        onClick: handleRefresh,
      },
    ],
    [handleEditSelected, handleRefresh, selectedIds],
  );

  return (
    <TablePage
      title={selectablesMeta.title}
      description={
        <>
          {selectablesMeta.description ? `${selectablesMeta.description} ` : ""}
          Total products: {totalCount}
        </>
      }
      actions={
        <>
          <Button
            color="secondary"
            variant="flat"
            startContent={<Sparkle size={20} weight="fill" />}
            onPress={handleGenerateSamples}
          >
            Generate Samples
          </Button>
          <Button
            color="primary"
            startContent={<Plus size={20} weight="bold" />}
            onPress={handleAddNew}
          >
            Add Product
          </Button>
        </>
      }
      className="relative"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <PaginationTable
          ref={tableRef}
          enableSelection
          {...selectablesConfig}
          onTotalsChange={({ totalCount }) => setTotalCount(totalCount)}
          onSelectionChange={handleSelectionChange}
        />
      </Suspense>

      <FloatingActionMenu
        selectedCount={selectedCount}
        onClear={handleClearSelection}
        actions={floatingActions}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Product Name"
                placeholder="Enter product name"
                value={formData.name}
                onValueChange={(value) => handleFormChange("name", value)}
                isRequired
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SKU"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onValueChange={(value) => handleFormChange("sku", value)}
                  isRequired
                />
                <Input
                  label="Category"
                  placeholder="Enter category"
                  value={formData.category}
                  onValueChange={(value) => handleFormChange("category", value)}
                  isRequired
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price.toString()}
                  onValueChange={(value) =>
                    handleFormChange("price", Number.parseFloat(value) || 0)
                  }
                  startContent={<span className="text-gray-500">$</span>}
                  isRequired
                />
                <Input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock.toString()}
                  onValueChange={(value) =>
                    handleFormChange("stock", Number.parseInt(value, 10) || 0)
                  }
                  isRequired
                />
              </div>
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={[formData.status]}
                onChange={(event) =>
                  handleFormChange("status", event.target.value)
                }
                isRequired
              >
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="out-of-stock">Out of Stock</SelectItem>
                <SelectItem key="discontinued">Discontinued</SelectItem>
              </Select>
              <Input
                label="Supplier"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onValueChange={(value) => handleFormChange("supplier", value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </TablePage>
  );
}
