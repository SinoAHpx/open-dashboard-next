"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { MagnifyingGlass, ArrowClockwise } from "@phosphor-icons/react";
import type { FilterConfig } from "./types";

export interface TableToolbarProps {
  enableSearch?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function TableToolbar({
  enableSearch = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  filterValues = {},
  onFilterChange,
  onRefresh,
  isLoading = false,
  className = "",
}: TableToolbarProps) {
  const hasControls =
    enableSearch || filters.length > 0 || typeof onRefresh === "function";

  if (!hasControls) {
    return null;
  }

  return (
    <div
      className={`mb-4 flex shrink-0 items-center gap-4 overflow-hidden ${className}`}
    >
      {enableSearch ? (
        <Input
          isClearable
          placeholder={searchPlaceholder}
          startContent={<MagnifyingGlass size={18} />}
          value={searchValue}
          onValueChange={onSearchChange}
          className="flex-1"
        />
      ) : null}

      {filters.map((filter) => (
        <Select
          key={filter.key}
          size="md"
          placeholder={filter.placeholder}
          selectedKeys={
            filterValues[filter.key] ? [filterValues[filter.key]] : []
          }
          onChange={(event) =>
            onFilterChange?.(filter.key, event.target.value)
          }
          className="w-48"
          aria-label={filter.label}
        >
          {filter.options.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
      ))}

      {onRefresh ? (
        <Button
          isIconOnly
          variant="flat"
          onPress={onRefresh}
          isLoading={isLoading}
          aria-label="Refresh"
        >
          <ArrowClockwise size={20} />
        </Button>
      ) : null}
    </div>
  );
}
