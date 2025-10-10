"use client";

import { useRef, useState, useMemo, Suspense } from "react";
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
  PaginationTable,
  type PaginationTableRef,
} from "@/components/PaginationTable";
import { createProductsConfig } from "@/lib/config/actions-products.config";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  generateSampleProducts,
  type Product,
} from "@/lib/api-wrapper/products";
import { useProductsPaginationStore } from "@/stores/dashboard/actions-products-store";

type ProductFormData = Omit<Product, "id" | "createdAt">;

export default function ActionsPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const totalCount = useProductsPaginationStore((state) => state.totalCount);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    status: "available",
    description: "",
    sku: "",
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      status: "available",
      description: "",
      sku: "",
    });
    onOpen();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
      sku: product.sku,
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

  // Create config with callbacks
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const productsConfig = useMemo(
    () =>
      createProductsConfig({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col p-8">
      <div className="mb-6 shrink-0 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Product Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your products with full CRUD operations. Total products:{" "}
            {totalCount}
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
        <PaginationTable
          ref={tableRef}
          store={useProductsPaginationStore}
          {...productsConfig}
        />
      </Suspense>

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
                <SelectItem key="available">Available</SelectItem>
                <SelectItem key="out_of_stock">Out of Stock</SelectItem>
                <SelectItem key="discontinued">Discontinued</SelectItem>
              </Select>
              <Input
                label="Description"
                placeholder="Enter product description"
                value={formData.description}
                onValueChange={(value) =>
                  handleFormChange("description", value)
                }
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
