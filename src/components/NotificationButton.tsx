"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { BellIcon } from "@phosphor-icons/react/dist/ssr";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "New team signup",
    description: "Sarah Connor just joined the workspace.",
    time: "2 minutes ago",
  },
  {
    id: "2",
    title: "Deployment successful",
    description: "Dashboard v2.3 was deployed to production.",
    time: "25 minutes ago",
  },
  {
    id: "3",
    title: "Payments report ready",
    description: "Your weekly revenue report is available to download.",
    time: "1 hour ago",
  },
];

export function NotificationButton() {
  return (
    <Popover placement="bottom-end" offset={8}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="full"
          aria-label="Open notifications"
          className="relative h-10 w-10 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:hover:border-gray-800 dark:hover:bg-gray-900"
        >
          <BellIcon size={22} className="text-gray-500 dark:text-gray-400" />
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 space-x-2">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Notifications
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            3 new
          </span>
        </div>
        <div className="space-y-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          {NOTIFICATIONS.map((notification) => (
            <div
              key={notification.id}
              className="rounded-lg border border-gray-100 bg-white p-3 text-left transition-colors hover:border-primary-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-primary-500/40"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {notification.title}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {notification.description}
              </p>
              <span className="mt-2 block text-[11px] font-medium uppercase tracking-wide text-primary-500">
                {notification.time}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
