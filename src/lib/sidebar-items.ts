import type { Icon } from "@phosphor-icons/react";

import {
  GearIcon,
  HouseIcon,
  TableIcon,
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
    ],
  },
];

export const bottomMenuItems: MenuItem[] = [
  { label: "Settings", href: "/settings", icon: GearIcon },
];
