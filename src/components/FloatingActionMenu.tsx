"use client";

import { Button, Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

export interface FloatingAction {
  key: string;
  label: string;
  icon: ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  onClick: () => void | Promise<void>;
}

export interface FloatingActionMenuProps {
  selectedCount: number;
  onClear: () => void;
  actions: FloatingAction[];
  show?: boolean;
}

export function FloatingActionMenu({
  selectedCount,
  onClear,
  actions,
  show = true,
}: FloatingActionMenuProps) {
  if (!show || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <Card
        shadow="lg"
        className="border border-gray-200 dark:border-gray-700 shadow-2xl shadow-black/20 dark:shadow-black/40"
      >
        <CardBody className="flex flex-row items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2 pr-3 border-r border-gray-300 dark:border-gray-600">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {selectedCount}
            </span>
            <Button
              size="sm"
              variant="light"
              onPress={onClear}
              className="min-w-unit-14 h-7 text-xs"
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            {actions.map((action) => (
              <Button
                key={action.key}
                size="sm"
                color={action.color || "default"}
                variant={action.variant || "flat"}
                startContent={action.icon}
                onPress={action.onClick}
                className="h-7 px-3 text-xs font-medium"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
