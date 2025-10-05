"use client";

import { useState } from "react";
import { CommandMenu } from "./CommandMenu";

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children}
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
