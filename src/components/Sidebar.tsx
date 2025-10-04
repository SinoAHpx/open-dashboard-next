"use client";

import { Listbox, ListboxItem } from "@heroui/listbox";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", href: "/" },
    { key: "analytics", label: "Analytics", href: "/analytics" },
    { key: "users", label: "Users", href: "/users" },
    { key: "settings", label: "Settings", href: "/settings" },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

        <Listbox
          aria-label="Navigation"
          variant="flat"
          selectedKeys={[pathname === "/" ? "dashboard" : pathname.slice(1)]}
        >
          {menuItems.map((item) => (
            <ListboxItem
              key={item.key}
              href={item.href}
              className="mb-1"
            >
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    </aside>
  );
}
