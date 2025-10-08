import type { Icon } from "@phosphor-icons/react";

import { GearIcon, HouseIcon } from "@phosphor-icons/react";
import { UserIcon, ChartBarIcon, BellIcon, CalendarIcon, CameraIcon, ChatIcon, ClipboardIcon, CloudIcon, CodeIcon, DatabaseIcon, DownloadIcon, EyeIcon, FileIcon, FolderIcon, GameControllerIcon, GlobeIcon, HeartIcon, ImageIcon, KeyIcon, LightbulbIcon, LockIcon, MicrophoneIcon, MoonIcon, MusicNoteIcon, NewspaperIcon, PaletteIcon, PlayIcon, RocketIcon, ShareIcon, ShoppingCartIcon, StarIcon, SunIcon, TargetIcon, TerminalIcon, ThumbsUpIcon, TimerIcon, TrophyIcon, UploadIcon, VideoIcon, WalletIcon, WarningIcon } from "@phosphor-icons/react";

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: Icon;
}

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: Icon;
}

export const menuItems: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: HouseIcon },
  { key: "settings", label: "Settings", href: "/settings", icon: GearIcon },
  { key: "profile", label: "Profile", href: "/profile", icon: UserIcon },
  { key: "analytics", label: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { key: "notifications", label: "Notifications", href: "/notifications", icon: BellIcon },
  { key: "calendar", label: "Calendar", href: "/calendar", icon: CalendarIcon },
  { key: "camera", label: "Camera", href: "/camera", icon: CameraIcon },
  { key: "chat", label: "Chat", href: "/chat", icon: ChatIcon },
  { key: "clipboard", label: "Clipboard", href: "/clipboard", icon: ClipboardIcon },
  { key: "cloud", label: "Cloud", href: "/cloud", icon: CloudIcon },
  { key: "code", label: "Code", href: "/code", icon: CodeIcon },
  { key: "database", label: "Database", href: "/database", icon: DatabaseIcon },
  { key: "download", label: "Download", href: "/download", icon: DownloadIcon },
  { key: "eye", label: "Eye", href: "/eye", icon: EyeIcon },
  { key: "file", label: "File", href: "/file", icon: FileIcon },
  { key: "folder", label: "Folder", href: "/folder", icon: FolderIcon },
  { key: "game", label: "Game", href: "/game", icon: GameControllerIcon },
  { key: "globe", label: "Globe", href: "/globe", icon: GlobeIcon },
  { key: "heart", label: "Heart", href: "/heart", icon: HeartIcon },
  { key: "image", label: "Image", href: "/image", icon: ImageIcon },
  { key: "key", label: "Key", href: "/key", icon: KeyIcon },
  { key: "lightbulb", label: "Lightbulb", href: "/lightbulb", icon: LightbulbIcon },
  { key: "lock", label: "Lock", href: "/lock", icon: LockIcon },
  { key: "microphone", label: "Microphone", href: "/microphone", icon: MicrophoneIcon },
  { key: "moon", label: "Moon", href: "/moon", icon: MoonIcon },
  { key: "music", label: "Music", href: "/music", icon: MusicNoteIcon },
  { key: "news", label: "News", href: "/news", icon: NewspaperIcon },
  { key: "palette", label: "Palette", href: "/palette", icon: PaletteIcon },
];
