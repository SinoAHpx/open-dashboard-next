"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  ArrowClockwise,
  Plus,
  Sparkle,
  DotsThreeVertical,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import {
  getPaginatedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  generateSampleProducts,
  type Product,
} from "@/lib/api-wrapper/products";

const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

type ProductFormData = Omit<Product, "id" | "createdAt">;

export default function ActionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  // Initialize from URL on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const searchParam = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    if (pageParam) setPage(Number.parseInt(pageParam, 10));
    if (pageSizeParam) setPageSize(Number.parseInt(pageSizeParam, 10));
    if (searchParam) setSearch(searchParam);
    if (statusParam) setStatusFilter(statusParam);
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam) setSortOrder(sortOrderParam as "asc" | "desc");
  }, []);

  const statusColorMap: Record<
    Product["status"],
    "success" | "warning" | "danger"
  > = {
    available: "success",
    out_of_stock: "warning",
    discontinued: "danger",
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: (info) => (
          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            ${(info.getValue() as number).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            {info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as Product["status"];
          return (
            <Chip color={statusColorMap[status]} size="sm" variant="flat">
              {status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </Chip>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const product = info.row.original;
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  aria-label="Actions"
                >
                  <DotsThreeVertical size={18} weight="bold" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Product actions">
                <DropdownItem
                  key="edit"
                  startContent={<PencilSimple size={18} />}
                  onPress={() => handleEdit(product)}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={<Trash size={18} />}
                  color="danger"
                  className="text-danger"
                  onPress={() => handleDelete(product.id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) {
      params.set("search", search);
    }
    if (statusFilter) {
      params.set("status", statusFilter);
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, search, statusFilter, sortBy, sortOrder, router]);

  // Fetch data
  const fetchData = () => {
    setIsLoading(true);
    try {
      const response = getPaginatedProducts({
        page,
        pageSize,
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, statusFilter, sortBy, sortOrder]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10);
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSort = (columnId: string) => {
    if (columnId === "actions") return;

    if (sortBy === columnId) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortBy("");
        setSortOrder("asc");
      }
    } else {
      setSortBy(columnId);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleGenerateSamples = () => {
    generateSampleProducts(50);
    fetchData();
  };

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
      fetchData();
    }
  };

  const handleSubmit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
    fetchData();
  };

  const handleFormChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 shrink-0 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Product Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your products with full CRUD operations. Total products: {totalCount}
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

      <div className="mb-4 flex shrink-0 items-center gap-4">
        <Input
          isClearable
          placeholder="Search products..."
          startContent={<MagnifyingGlass size={18} />}
          value={search}
          onValueChange={handleSearchChange}
          className="flex-1"
        />
        <Select
          size="md"
          placeholder="Filter by status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-48"
          aria-label="Filter by status"
        >
          <SelectItem key="available">Available</SelectItem>
          <SelectItem key="out_of_stock">Out of Stock</SelectItem>
          <SelectItem key="discontinued">Discontinued</SelectItem>
        </Select>
        <Button
          isIconOnly
          variant="flat"
          onPress={handleRefresh}
          isLoading={isLoading}
          aria-label="Refresh"
        >
          <ArrowClockwise size={20} />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/80 dark:bg-gray-800/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.id !== "actions" ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={() => handleSort(header.column.id)}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.id !== "actions" && (
                            <span className="text-gray-400">
                              {sortBy === header.column.id && sortOrder === "asc" ? (
                                <CaretUp size={16} weight="fill" />
                              ) : sortBy === header.column.id && sortOrder === "desc" ? (
                                <CaretDown size={16} weight="fill" />
                              ) : (
                                <div className="flex flex-col">
                                  <CaretUp size={12} />
                                  <CaretDown size={12} className="-mt-1" />
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center">
                    <Spinner color="default" />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-20 text-center text-gray-500 dark:text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </span>
          <Select
            size="sm"
            selectedKeys={[pageSize.toString()]}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-20"
            aria-label="Select page size"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
          color="primary"
        />
      </div>

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
                  onValueChange={(value) => handleFormChange("price", Number.parseFloat(value) || 0)}
                  startContent={<span className="text-gray-500">$</span>}
                  isRequired
                />
                <Input
                  label="Stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock.toString()}
                  onValueChange={(value) => handleFormChange("stock", Number.parseInt(value) || 0)}
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
                onValueChange={(value) => handleFormChange("description", value)}
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
