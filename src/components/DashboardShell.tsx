"use client";

import { Authenticated } from "@refinedev/core";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated
      key="dashboard"
      loading={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Checking your session…</p>
        </div>
      }
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Redirecting to login…</p>
        </div>
      }
    >
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </Authenticated>
  );
}
