import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        primary: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#525252",
          500: "#404040",
          600: "#262626",
          700: "#1a1a1a",
          800: "#0f0f0f",
          900: "#0a0a0a",
          DEFAULT: "#0a0a0a",
          foreground: "#ffffff",
        },
        focus: "#0a0a0a",
      },
    },
    dark: {
      colors: {
        background: "#0a0a0a",
        foreground: "#fafafa",
        primary: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          DEFAULT: "#0a0a0a",
          foreground: "#ffffff",
        },
        focus: "#262626",
      },
    },
  },
});
