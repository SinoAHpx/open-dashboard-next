import type { Icon } from "@phosphor-icons/react";

import {
  BellIcon,
  CalendarIcon,
  GearIcon,
  HouseIcon,
  TableIcon,
  UserIcon,
  TextboxIcon,
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
  {
    groupLabel: "Forms",
    items: [
      { label: "Authentication", href: "/forms/authentication", icon: TextboxIcon },
      { label: "User & Profile", href: "/forms/user-profile", icon: TextboxIcon },
      { label: "Data Management", href: "/forms/data-management", icon: TextboxIcon },
      { label: "Settings & Config", href: "/forms/settings-config", icon: TextboxIcon },
      { label: "Interaction & Filtering", href: "/forms/interaction-filtering", icon: TextboxIcon },
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  { label: "Settings", href: "/settings", icon: GearIcon },
];
