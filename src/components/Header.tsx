"use client";

import { UserAvatar } from "./UserAvatar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* You can add breadcrumbs, page title, or other header content here */}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Add other header actions like search, notifications, etc. */}
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
