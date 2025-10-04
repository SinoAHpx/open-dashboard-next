import type { Icon } from "@phosphor-icons/react";

import {
  ChartBarIcon,
  FileIcon,
  GearIcon,
  HouseIcon,
  UsersIcon,
} from "@phosphor-icons/react";

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: Icon;
}

export const menuItems: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: HouseIcon },
  {
    key: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: ChartBarIcon,
  },
  { key: "users", label: "Users", href: "/users", icon: UsersIcon },
  { key: "settings", label: "Settings", href: "/settings", icon: GearIcon },

  { key: "testpage", label: "TestPage", href: "/testpage", icon: FileIcon },
];
