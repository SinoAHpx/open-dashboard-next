import type { Icon } from "@phosphor-icons/react";

import {
  BellIcon,
  CalendarIcon,
  GearIcon,
  HouseIcon,
  TableIcon,
  UserIcon,
  TextboxIcon,
  WarningIcon,
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
    items: [{ label: "Dashboard", href: "/", icon: HouseIcon }],
  },
  {
    groupLabel: "Table",
    items: [
      { label: "Users", href: "/tables/users", icon: TableIcon },
      { label: "Pets", href: "/tables/pets", icon: TableIcon },
      { label: "Stores", href: "/tables/stores", icon: TableIcon },
      { label: "Orders", href: "/tables/orders", icon: TableIcon },
      { label: "Simple", href: "/tables/simple", icon: TableIcon },
      { label: "Pagination", href: "/tables/pagination", icon: TableIcon },
      { label: "Actions", href: "/tables/actions", icon: TableIcon },
      { label: "Rich Cell", href: "/tables/rich-cell", icon: TableIcon },
      { label: "Selectables", href: "/tables/selectables", icon: TableIcon },
    ],
  },
  {
    groupLabel: "Forms",
    items: [
      {
        label: "User & Profile",
        href: "/forms/user-profile",
        icon: TextboxIcon,
      },
      {
        label: "Data Management",
        href: "/forms/data-management",
        icon: TextboxIcon,
      },
      {
        label: "Settings & Config",
        href: "/forms/settings-config",
        icon: TextboxIcon,
      },
      {
        label: "Interaction & Filtering",
        href: "/forms/interaction-filtering",
        icon: TextboxIcon,
      },
    ],
  },
  {
    groupLabel: "Error Pages",
    items: [
      { label: "Unauthorized", href: "/errors/401", icon: WarningIcon },
      { label: "Forbidden", href: "/errors/403", icon: WarningIcon },
      { label: "Not Found", href: "/errors/404", icon: WarningIcon },
      { label: "Server Error", href: "/errors/500", icon: WarningIcon },
      { label: "Maintenance", href: "/errors/503", icon: WarningIcon },
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  { label: "Settings", href: "/settings", icon: GearIcon },
];
