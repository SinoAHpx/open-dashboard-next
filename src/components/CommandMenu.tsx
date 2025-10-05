"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Kbd } from "@heroui/react";
import {
  MagnifyingGlassIcon,
  HouseIcon,
  ChartBarIcon,
  UsersIcon,
  GearIcon,
  FileIcon,
  UserIcon,
  BellIcon,
  SignOutIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react/dist/ssr";
import { menuItems } from "@/lib/sidebar-items";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Command Menu */}
      <Command.Dialog
        open={open}
        onOpenChange={onOpenChange}
        label="Global Command Menu"
        className="fixed left-[50%] top-[30%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-30%] animate-in fade-in-90 slide-in-from-bottom-10"
      >
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
            <MagnifyingGlassIcon
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-14 w-full bg-transparent px-4 text-sm text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
            />
            <Kbd className="hidden sm:inline-flex">
              ESC
            </Kbd>
          </div>

          {/* Command List */}
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            {/* Navigation Section */}
            <Command.Group
              heading="Navigation"
              className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.key}
                    value={item.label}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 transition-colors"
                  >
                    <Icon
                      size={18}
                      className="mr-3 text-gray-600 dark:text-gray-400"
                    />
                    <span className="text-foreground">{item.label}</span>
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                      Go to {item.label.toLowerCase()}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Account Section */}
            <Command.Group
              heading="Account"
              className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400"
            >
              <Command.Item
                value="Profile"
                onSelect={() => runCommand(() => router.push("/profile"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800 transition-colors"
              >
                <UserIcon
                  size={18}
                  className="mr-3 text-gray-600 dark:text-gray-400"
                />
                <span className="text-foreground">Profile</span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  View profile
                </span>
              </Command.Item>
              <Command.Item
                value="Notifications"
                onSelect={() =>
                  runCommand(() => router.push("/notifications"))
                }
                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800 transition-colors"
              >
                <BellIcon
                  size={18}
                  className="mr-3 text-gray-600 dark:text-gray-400"
                />
                <span className="text-foreground">Notifications</span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  View notifications
                </span>
              </Command.Item>
            </Command.Group>

            {/* Preferences Section */}
            <Command.Group
              heading="Preferences"
              className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400"
            >
              <Command.Item
                value="Toggle Theme"
                onSelect={() =>
                  runCommand(() => {
                    // Theme toggle logic here
                    console.log("Toggle theme");
                  })
                }
                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800 transition-colors"
              >
                <MoonIcon
                  size={18}
                  className="mr-3 text-gray-600 dark:text-gray-400"
                />
                <span className="text-foreground">Toggle Theme</span>
                <Kbd className="ml-auto hidden sm:inline-flex" keys={["command"]}>
                  T
                </Kbd>
              </Command.Item>
            </Command.Group>

            {/* Actions Section */}
            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400"
            >
              <Command.Item
                value="Logout"
                onSelect={() => runCommand(() => router.push("/login"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-red-50 dark:data-[selected=true]:bg-red-950/20 transition-colors"
              >
                <SignOutIcon
                  size={18}
                  className="mr-3 text-red-600 dark:text-red-400"
                />
                <span className="text-red-600 dark:text-red-400">Logout</span>
                <span className="ml-auto text-xs text-red-400 dark:text-red-500">
                  Sign out
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>Navigate with arrow keys</span>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1">
                  Open
                  <Kbd keys={["command"]}>
                    K
                  </Kbd>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  Close
                  <Kbd>
                    ESC
                  </Kbd>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
