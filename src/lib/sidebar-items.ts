import type { Icon } from "@phosphor-icons/react";

import {
  BellIcon,
  CalendarIcon,
  GearIcon,
  HouseIcon,
  TableIcon,
  UserIcon,
} from "@phosphor-icons/react";

export interface MenuItem {
  label: string;
  href: string;
  icon: Icon;
}

export interface MenuGroup {
  groupLabel?: string;
  items: MenuItem[];
}

export const mainMenuItems: MenuGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: HouseIcon },
    ],
  },
  {
    groupLabel: "Table",
    items: [
      { label: "Simple", href: "/simple", icon: TableIcon },
      { label: "Pagination", href: "/pagination", icon: TableIcon },
      { label: "Actions", href: "/actions", icon: TableIcon },
      { label: "Rich Cell", href: "/rich-cell", icon: TableIcon },
      { label: "Selectables", href: "/selectables", icon: TableIcon },
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  { label: "Settings", href: "/settings", icon: GearIcon },
];
