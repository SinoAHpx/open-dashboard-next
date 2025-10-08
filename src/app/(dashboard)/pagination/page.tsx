"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Chip, Pagination } from "@heroui/react";
import {
  getPaginationUsers,
  type PaginationUser,
} from "@/lib/api-wrapper/pagination";

export default function PaginationPage() {
  const [data, setData] = useState<PaginationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const columns: ColumnDef<PaginationUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as PaginationUser["status"];
        const statusColorMap: Record<
          PaginationUser["status"],
          "success" | "warning" | "danger"
        > = {
          active: "success",
          pending: "warning",
          inactive: "danger",
        };
        return (
          <Chip color={statusColorMap[status]} size="sm" variant="flat">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Chip>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400">
          {info.getValue() as string}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getPaginationUsers({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
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
  }, [pagination.pageIndex, pagination.pageSize]);

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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                      >
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

      <div className="mt-6 flex shrink-0 justify-center">
        <Pagination
          total={totalPages}
          page={pagination.pageIndex + 1}
          onChange={(page) =>
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
          }
          showControls
          color="primary"
        />
      </div>
    </div>
  );
}
