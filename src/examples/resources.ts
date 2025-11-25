import type { IResourceItem } from "@refinedev/core";

/**
 * Example resources for Refine.
 * These map to the table demonstration pages.
 */
export const exampleResources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: { label: "Dashboard" },
  },
  {
    name: "users",
    list: "/tables/pagination",
    meta: { label: "Users" },
  },
  {
    name: "products",
    list: "/tables/actions",
    meta: { label: "Products" },
  },
  {
    name: "simple-table",
    list: "/tables/simple",
    meta: { label: "Simple Table" },
  },
  {
    name: "tasks",
    list: "/tables/rich-cell",
    meta: { label: "Rich Cell Table" },
  },
  {
    name: "selectables",
    list: "/tables/selectables",
    meta: { label: "Selectable Table" },
  },
  {
    name: "profiles",
    list: "/forms/user-profile",
    meta: { label: "User & Profile" },
  },
  {
    name: "data-management",
    list: "/forms/data-management",
    meta: { label: "Data Management" },
  },
  {
    name: "settings-config",
    list: "/forms/settings-config",
    meta: { label: "Settings Config" },
  },
  {
    name: "interaction-filtering",
    list: "/forms/interaction-filtering",
    meta: { label: "Interaction Filtering" },
  },
  {
    name: "settings",
    list: "/settings",
    meta: { label: "Settings" },
  },
];
