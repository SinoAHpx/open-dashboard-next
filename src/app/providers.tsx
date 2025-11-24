"use client";

import { HeroUIProvider } from "@heroui/react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { authProvider } from "@/lib/refine/auth-provider";
import { refineDataProvider } from "@/lib/refine/data-provider";
import { resources } from "@/lib/refine/resources";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Refine
        routerProvider={routerProvider}
        dataProvider={refineDataProvider}
        authProvider={authProvider}
        resources={resources}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        {children}
      </Refine>
    </HeroUIProvider>
  );
}
