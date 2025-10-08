import { heroui } from "@heroui/react";
import { COLOR_THEME } from "../lib/color-theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: COLOR_THEME.light.background,
        foreground: COLOR_THEME.light.foreground,
        primary: COLOR_THEME.light.primary,
        focus: COLOR_THEME.light.focus,
      },
    },
    dark: {
      colors: {
        background: COLOR_THEME.dark.background,
        foreground: COLOR_THEME.dark.foreground,
        primary: COLOR_THEME.dark.primary,
        focus: COLOR_THEME.dark.focus,
      },
    },
  },
});
