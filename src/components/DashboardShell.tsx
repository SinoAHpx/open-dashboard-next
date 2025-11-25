"use client";

import { useGo, useIsAuthenticated } from "@refinedev/core";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useIsAuthenticated();
  const go = useGo();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (!isLoading && data?.authenticated === false && !didRedirect.current) {
      didRedirect.current = true;
      void go({
        to: (data?.redirectTo as string) || "/login",
        type: "replace",
      });
    }
  }, [data?.authenticated, data?.redirectTo, go, isLoading]);

  if (isLoading || data === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Checking your session…</p>
      </div>
    );
  }

  if (data?.authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-500">Redirecting to login…</p>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
