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
import { Plus, Sparkle } from "@phosphor-icons/react";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import {
  createProductsConfig,
  generateProducts,
  type Product,
  productsHandlers,
  productsMeta,
} from "@/examples/products";
import {
  PaginationTable,
  type PaginationTableRef,
  TablePage,
} from "@/infra/table";

type ProductFormData = Omit<Product, "id" | "createdAt">;

export default function ActionsPage() {
  const tableRef = useRef<PaginationTableRef>(null);
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

  const handleAddNew = useCallback(() => {
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
  }, [onOpen]);

  const handleEdit = useCallback(
    (product: Product) => {
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
    },
    [onOpen],
  );

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await productsHandlers.deleteOne?.(id);
      tableRef.current?.refresh();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (editingProduct) {
      await productsHandlers.update?.(editingProduct.id, formData);
    } else {
      await productsHandlers.create?.(formData);
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
    // Generate and save sample products via localStorage
    const products = generateProducts(50);
    const existing = JSON.parse(
      localStorage.getItem("example-products") || "[]",
    );
    localStorage.setItem(
      "example-products",
      JSON.stringify([...products, ...existing]),
    );
    tableRef.current?.refresh();
  }, []);

  const [totalCount, setTotalCount] = useState(0);
  const config = useMemo(
    () =>
      createProductsConfig({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEdit],
  );

  return (
    <TablePage
      title={productsMeta.title}
      description={
        <>
          {productsMeta.description ? `${productsMeta.description} ` : ""}
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
          {...config}
          onTotalsChange={({ totalCount }) => setTotalCount(totalCount)}
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
    </TablePage>
  );
}
