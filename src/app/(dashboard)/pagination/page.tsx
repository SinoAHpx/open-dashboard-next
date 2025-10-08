"use client";

import { useEffect, useState } from "react";
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
} from "@heroui/react";
import {
  getPaginationUsers,
  type PaginationUser,
} from "@/lib/api-wrapper/pagination";

const PAGE_SIZE_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

export default function PaginationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? Number.parseInt(pageParam, 10) : 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? Number.parseInt(pageSizeParam, 15) : 15;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const statusColorMap: Record<
    PaginationUser["status"],
    "success" | "warning" | "danger"
  > = {
    active: "success",
    pending: "warning",
    inactive: "danger",
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "joinDate", label: "Join Date" },
  ];

  const renderCell = (user: PaginationUser, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return <span className="font-medium">{user.name}</span>;
      case "email":
        return (
          <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
        );
      case "status":
        return (
          <Chip color={statusColorMap[user.status]} size="sm" variant="flat">
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Chip>
        );
      case "role":
        return (
          <span className="text-gray-600 dark:text-gray-400">{user.role}</span>
        );
      case "department":
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {user.department}
          </span>
        );
      case "joinDate":
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {user.joinDate}
          </span>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, pageSize, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPaginationUsers({
          page,
          pageSize,
        });
        setData(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } catch (error) {
        console.error("Failed to load pagination users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10);
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pagination Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Server-side pagination with TanStack Table and Hero UI. Total records:{" "}
          {totalCount}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col ">
        <Table
          aria-label="Pagination table with server-side data"
          classNames={{
            wrapper: "h-full overflow-auto",
            base: "h-full",
            th: "sticky top-0 z-10 backdrop-blur-md bg-gray-50/80 dark:bg-gray-800/80",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data}
            isLoading={isLoading}
            loadingContent={<Spinner color="default" />}
            emptyContent="No users found"
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </div>
  );
}
