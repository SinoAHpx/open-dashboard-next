"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export interface ActionMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  className?: string;
  onPress: () => void;
}

export interface ActionMenuProps {
  items?: ActionMenuItem[];
  onEdit?: () => void;
  onDelete?: () => void;
  ariaLabel?: string;
}

/**
 * Reusable action menu dropdown.
 * Can use default edit/delete actions or provide custom items.
 *
 * @example
 * ```tsx
 * // Default edit/delete
 * <ActionMenu onEdit={() => {}} onDelete={() => {}} />
 *
 * // Custom items
 * <ActionMenu items={[
 *   { key: "view", label: "View", onPress: () => {} },
 *   { key: "edit", label: "Edit", icon: <PencilSimple />, onPress: () => {} },
 * ]} />
 * ```
 */
export function ActionMenu({
  items,
  onEdit,
  onDelete,
  ariaLabel = "Actions",
}: ActionMenuProps) {
  const menuItems: ActionMenuItem[] = items ?? [
    ...(onEdit
      ? [
          {
            key: "edit",
            label: "Edit",
            icon: <PencilSimple size={18} />,
            onPress: onEdit,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            key: "delete",
            label: "Delete",
            icon: <Trash size={18} />,
            color: "danger" as const,
            className: "text-danger",
            onPress: onDelete,
          },
        ]
      : []),
  ];

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light" aria-label={ariaLabel}>
          <DotsThreeVertical size={18} weight="bold" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={ariaLabel}>
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            startContent={item.icon}
            color={item.color}
            className={item.className}
            onPress={item.onPress}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
