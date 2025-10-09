"use client";

import { PaginationTable } from "@/components/pagination-table";
import { paginationUsersConfig } from "@/config/pagination-users.config";

export default function PaginationPage() {
  return <PaginationTable {...paginationUsersConfig} />;
}
