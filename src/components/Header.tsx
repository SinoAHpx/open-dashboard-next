"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button, Kbd } from "@heroui/react";
import { NotificationButton } from "./NotificationButton";
import { UserAvatar } from "./UserAvatar";
import { useCommandMenu } from "@/stores/command-menu";

export function Header() {
  const { open } = useCommandMenu();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          {/* Search Box */}
          <Button
            variant="flat"
            onPress={open}
            className="w-full max-w-md justify-start gap-3 px-4 py-2 h-auto min-h-10 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-950"
            startContent={
              <MagnifyingGlassIcon
                size={18}
                className="text-gray-400 dark:text-gray-500"
              />
            }
            endContent={<Kbd keys={["command"]}>K</Kbd>}
          >
            <span className="flex-1 text-left text-gray-400 dark:text-gray-500">
              Search
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <NotificationButton />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
