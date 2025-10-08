"use client";

import { CommandMenu } from "./CommandMenu";
import { useCommandMenu } from "@/stores/command-menu";

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useCommandMenu((state) => state.isOpen);
  const close = useCommandMenu((state) => state.close);
  const open = useCommandMenu((state) => state.open);

  const handleOpenChange = (value: boolean) => {
    if (value) {
      open();
    } else {
      close();
    }
  };

  return (
    <>
      {children}
      <CommandMenu open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
}
