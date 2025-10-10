"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { Plus, Sparkle } from "@phosphor-icons/react";
import {
  SelectableTable,
  type SelectableTableRef,
} from "@/components/SelectableTable";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import {
  selectableProductsConfig,
  createFloatingActionsConfig,
} from "@/lib/config/selectable-products.config";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  generateSampleProducts,
  type SelectableProduct,
} from "@/lib/api-wrapper/selectables";

type ProductFormData = Omit<SelectableProduct, "id" | "lastRestocked">;

export default function SelectablesPage() {
  const tableRef = useRef<SelectableTableRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const handleAddNew = () => {
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
  };

  const handleEdit = (product: SelectableProduct) => {
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
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      tableRef.current?.refresh();
    }
  };

  const handleSubmit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
    tableRef.current?.refresh();
  };

  const handleFormChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateSamples = () => {
    generateSampleProducts(50);
    tableRef.current?.refresh();
  };

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
      <div className="mb-6 shrink-0 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Selectable Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Select multiple products to perform bulk operations. Total products:{" "}
            {tableRef.current?.getTotalCount() || 0}
          </p>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        }
      >
        <SelectableTable ref={tableRef} {...selectableProductsConfig} />
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
                    handleFormChange("stock", Number.parseInt(value) || 0)
                  }
                  isRequired
                />
              </div>
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={[formData.status]}
                onChange={(e) => handleFormChange("status", e.target.value)}
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
                isRequired
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
    </div>
  );
}
