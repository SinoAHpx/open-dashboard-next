"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";
import {
  BellIcon,
  GearIcon,
  MoonIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import type { Key } from "react";
import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

export function UserAvatar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    if (signOutError) {
      console.error("[auth] Sign out failed:", signOutError);
    }
  }, [signOutError]);

  const displayName = useMemo(() => {
    if (session?.user?.name) {
      return session.user.name;
    }
    return session?.user?.email ?? "User";
  }, [session]);

  const avatarSrc = session?.user?.image ?? undefined;

  const handleAction = async (key: Key) => {
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
        try {
          setIsSigningOut(true);
          setSignOutError(null);
          const result = await signOut();
          if (result?.error) {
            setSignOutError(result.error.message ?? "Sign out failed");
            return;
          }
          router.push("/login");
          router.refresh();
        } catch (error: any) {
          setSignOutError(
            error.message ?? "Unable to sign out. Please try again.",
          );
        } finally {
          setIsSigningOut(false);
        }
        break;
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          radius="full"
          endContent={
            isPending ? (
              <Spinner size="sm" />
            ) : (
              <Avatar
                className="transition-transform"
                color="primary"
                name={displayName}
                size="sm"
                src={avatarSrc}
              />
            )
          }
        >
          <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
            {displayName}
          </span>
        </Button>
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
            startContent={<UserIcon size={20} />}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            key="settings"
            description="Manage your settings"
            startContent={<GearIcon size={20} />}
          >
            Settings
          </DropdownItem>
          <DropdownItem
            key="notifications"
            description="View notifications"
            startContent={<BellIcon size={20} />}
          >
            Notifications
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Preferences" showDivider>
          <DropdownItem
            key="theme"
            description="Toggle dark mode"
            startContent={<MoonIcon size={20} />}
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
            startContent={<SignOutIcon size={20} />}
            isDisabled={isSigningOut}
          >
            Logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
