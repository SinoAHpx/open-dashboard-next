/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import {
  useRef,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
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
  type SelectionChangePayload,
} from "@/components/PaginationTable";
import { TablePage } from "@/components/table/TablePage";
import type { TableStateSnapshot } from "@/components/table/types";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import { selectableProductsBlueprint } from "@/lib/config/selectable-products.config";
import {
  addProduct,
  updateProduct,
  generateSampleProducts,
  getProducts,
  type SelectableProduct,
} from "@/lib/api-wrapper/selectables";

type ProductFormData = Omit<SelectableProduct, "id" | "lastRestocked">;

export default function SelectablesPage() {
  const tableRef = useRef<PaginationTableRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { store, config: tableConfig, meta: tableMeta } = useMemo(
    () => selectableProductsBlueprint.createInstance(undefined),
    []
  );
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableState, setTableState] = useState<TableStateSnapshot>({
    page: 1,
    pageSize: tableConfig.defaultPageSize ?? 10,
    totalPages: 1,
    totalCount: 0,
    isLoading: true,
  });
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
    [onOpen]
  );

  const handleSubmit = useCallback(() => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
    tableRef.current?.refresh();
  }, [editingProduct, formData, onClose, tableRef]);

  const handleFormChange = useCallback(
    (field: keyof ProductFormData, value: string | number) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const handleGenerateSamples = useCallback(() => {
    generateSampleProducts(50);
    tableRef.current?.refresh();
  }, [tableRef]);

  const handleClearSelection = useCallback(() => {
    tableRef.current?.clearSelection();
  }, [tableRef]);

  const handleRefresh = useCallback(() => {
    tableRef.current?.refresh();
  }, [tableRef]);

  const handleSelectionChange = useCallback(
    (payload: SelectionChangePayload<SelectableProduct>) => {
      setSelectedIds(payload.ids);
      setSelectedCount(payload.ids.length);
    },
    []
  );

  const handleEditSelected = useCallback(
    (id: string) => {
      const product = getProducts().find((item) => item.id === id);
      if (product) {
        handleEdit(product);
      }
    },
    [handleEdit]
  );

  const floatingActions = useMemo(
    () =>
      selectableProductsBlueprint.createActions({
        selectedIds,
        onClear: handleClearSelection,
        onRefresh: handleRefresh,
        onEdit: handleEditSelected,
      }),
    [handleClearSelection, handleEditSelected, handleRefresh, selectedIds]
  );

  return (
    <TablePage
      title={tableMeta.title}
      description={
        <>
          {tableMeta.description ? `${tableMeta.description} ` : ""}
          Total products: {tableState.totalCount}
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
          store={store}
          enableSelection
          {...tableConfig}
          onStateChange={setTableState}
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
                  onValueChange={(value) =>
                    handleFormChange("category", value)
                  }
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
