"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/sidebar-items";

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = pathname === item.href;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <Icon
                  size={20}
                  weight={isSelected ? "fill" : "regular"}
                  className={
                    isSelected
                      ? "text-primary-foreground"
                      : "text-gray-600 dark:text-gray-400"
                  }
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
