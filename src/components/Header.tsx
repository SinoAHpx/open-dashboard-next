"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Kbd } from "@heroui/react";
import { UserAvatar } from "./UserAvatar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          {/* Search Box */}
          <div className="flex items-center gap-3 w-full max-w-md px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 focus-within:border-gray-400 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-950">
            <MagnifyingGlass
              size={18}
              className="text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              aria-label="Search"
              placeholder="Search"
              className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            />
            <Kbd keys={["command"]}>K</Kbd>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
