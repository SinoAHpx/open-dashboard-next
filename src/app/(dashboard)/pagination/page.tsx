"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { getSimpleUsers, type SimpleUser } from "@/lib/api-wrapper/simple";

export default function PaginationPage() {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSimpleUsers()
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load users:", error);
        setIsLoading(false);
      });
  }, []);

  const statusColorMap: Record<
    SimpleUser["status"],
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
  ];

  const renderCell = (user: SimpleUser, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return <span className="font-medium">{user.name}</span>;
      case "email":
        return <span className="text-gray-600 dark:text-gray-400">{user.email}</span>;
      case "status":
        return (
          <Chip color={statusColorMap[user.status]} size="sm" variant="flat">
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Chip>
        );
      case "role":
        return <span className="text-gray-600 dark:text-gray-400">{user.role}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Pagination Table
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Table with pagination functionality
        </p>
      </div>

      <Table aria-label="Pagination table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isLoading}
          loadingContent={<span>Loading...</span>}
          emptyContent="No users found"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
