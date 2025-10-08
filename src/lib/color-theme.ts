/**
 * Global Color Theme Constitution
 *
 * This file defines the canonical color theme for the application.
 * All colors should be accessed through the utility functions provided here
 * to ensure consistency and maintainability.
 */

export const COLOR_THEME = {
  light: {
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
  dark: {
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
} as const;

/**
 * Get primary color for a specific shade
 * @param shade - The shade level (50-900 or 'DEFAULT')
 * @param theme - 'light' or 'dark'
 * @returns The hex color value
 */
export function getPrimaryColor(
  shade: keyof typeof COLOR_THEME.light.primary,
  theme: "light" | "dark" = "light"
): string {
  return COLOR_THEME[theme].primary[shade];
}

/**
 * Get background color
 * @param theme - 'light' or 'dark'
 * @returns The hex color value
 */
export function getBackground(theme: "light" | "dark" = "light"): string {
  return COLOR_THEME[theme].background;
}

/**
 * Get foreground color
 * @param theme - 'light' or 'dark'
 * @returns The hex color value
 */
export function getForeground(theme: "light" | "dark" = "light"): string {
  return COLOR_THEME[theme].foreground;
}

/**
 * Get focus color
 * @param theme - 'light' or 'dark'
 * @returns The hex color value
 */
export function getFocusColor(theme: "light" | "dark" = "light"): string {
  return COLOR_THEME[theme].focus;
}

/**
 * Get a grayscale palette for charts
 * @param theme - 'light' or 'dark'
 * @param count - Number of colors to return (default: 5)
 * @returns Array of hex color values
 */
export function getChartColorPalette(
  theme: "light" | "dark" = "light",
  count: number = 5
): string[] {
  const shades = [900, 800, 700, 600, 500, 400, 300, 200, 100] as const;
  return shades.slice(0, count).map((shade) => COLOR_THEME[theme].primary[shade]);
}

/**
 * Get semantic chart colors for specific data types
 * @param theme - 'light' or 'dark'
 * @returns Object with semantic color mappings
 */
export function getChartColors(theme: "light" | "dark" = "light") {
  return {
    primary: COLOR_THEME[theme].primary.DEFAULT,
    secondary: COLOR_THEME[theme].primary[500],
    tertiary: COLOR_THEME[theme].primary[700],
    accent1: COLOR_THEME[theme].primary[600],
    accent2: COLOR_THEME[theme].primary[800],
    grid: theme === "light" ? "#e5e7eb" : "#374151",
    axis: theme === "light" ? "#6b7280" : "#9ca3af",
  };
}

/**
 * Hook to get theme-aware colors (can be used in client components)
 * Note: This returns the light theme by default.
 * In a real app, you'd detect the actual theme from context/store.
 */
export function useThemeColors() {
  // TODO: In production, detect actual theme from useTheme() or similar
  const currentTheme: "light" | "dark" = "light";

  return {
    theme: currentTheme,
    primary: (shade: keyof typeof COLOR_THEME.light.primary) =>
      getPrimaryColor(shade, currentTheme),
    background: getBackground(currentTheme),
    foreground: getForeground(currentTheme),
    focus: getFocusColor(currentTheme),
    chartPalette: getChartColorPalette(currentTheme),
    chartColors: getChartColors(currentTheme),
  };
}
