"use client";

import { Chip } from "@heroui/react";

export type ChipColor =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "secondary"
  | "default";

export interface StatusChipProps<T extends string> {
  status: T;
  colorMap: Record<T, ChipColor>;
  labelMap?: Record<T, string>;
  size?: "sm" | "md" | "lg";
  variant?:
    | "flat"
    | "bordered"
    | "solid"
    | "faded"
    | "shadow"
    | "light"
    | "dot";
}

/**
 * Reusable status chip with configurable color mapping.
 *
 * @example
 * ```tsx
 * <StatusChip
 *   status="active"
 *   colorMap={{ active: "success", pending: "warning", inactive: "danger" }}
 *   labelMap={{ active: "Active", pending: "Pending", inactive: "Inactive" }}
 * />
 * ```
 */
export function StatusChip<T extends string>({
  status,
  colorMap,
  labelMap,
  size = "sm",
  variant = "flat",
}: StatusChipProps<T>) {
  const color = colorMap[status] ?? "default";
  const label = labelMap?.[status] ?? formatStatus(status);

  return (
    <Chip color={color} size={size} variant={variant}>
      {label}
    </Chip>
  );
}

function formatStatus(status: string): string {
  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
