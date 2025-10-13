"use client";

import { Pagination, Select, SelectItem } from "@heroui/react";

export interface TablePaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function TablePaginationControls({
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  className = "",
}: TablePaginationControlsProps) {
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div
      className={`mt-6 flex shrink-0 items-center justify-between overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Rows per page:
        </span>
        <Select
          size="sm"
          selectedKeys={[pageSize.toString()]}
          onChange={(event) =>
            onPageSizeChange(Number.parseInt(event.target.value, 10))
          }
          className="w-20"
          aria-label="Select page size"
        >
          {pageSizeOptions.map((option) => (
            <SelectItem key={option.toString()}>
              {option.toString()}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Pagination
        total={totalPages}
        page={page}
        onChange={onPageChange}
        showControls
        color="primary"
      />
    </div>
  );
}
