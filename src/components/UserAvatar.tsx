"use client";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/react";
import {
  User,
  Gear,
  SignOut,
  Moon,
  Sun,
  Bell,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export function UserAvatar() {
  const router = useRouter();

  const handleAction = (key: React.Key) => {
    switch (key) {
      case "profile":
        router.push("/profile");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "theme":
        // Toggle theme logic here
        break;
      case "logout":
        // Logout logic here
        router.push("/login");
        break;
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform hover:scale-105"
          color="primary"
          name="User"
          size="sm"
          src="https://i.pravatar.cc/150?u=user@example.com"
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User Actions"
        onAction={handleAction}
        variant="flat"
      >
        <DropdownSection title="Account" showDivider>
          <DropdownItem
            key="profile"
            description="View your profile"
            startContent={<User size={20} />}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key="settings"
            description="Manage your settings"
            startContent={<Gear size={20} />}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="notifications"
            description="View notifications"
            startContent={<Bell size={20} />}
          >
            Notifications
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Preferences" showDivider>
          <DropdownItem
            key="theme"
            description="Toggle dark mode"
            startContent={<Moon size={20} />}
          >
            Theme
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            description="Sign out of your account"
            startContent={<SignOut size={20} />}
          >
            Logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
