import { useMemo } from "react";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { useAccessibility } from "@/contexts/accessibility-context";

const HIGH_CONTRAST_LIGHT = {
  text: "#000000",
  textSecondary: "#1A1A1A",
  mutedForeground: "#333333",
  border: "#333333",
  input: "#333333",
  grayLight: "#555555",
} as const;

const HIGH_CONTRAST_DARK = {
  text: "#FFFFFF",
  textSecondary: "#E0E0E0",
  mutedForeground: "#DDDDDD",
  border: "#CCCCCC",
  input: "#CCCCCC",
  grayLight: "#BBBBBB",
} as const;

/**
 * Returns the current color scheme and the matching color palette.
 * Applies high contrast overrides when accessibility setting is active.
 */
export function useAppColors() {
  const { colorScheme } = useColorScheme();
  const { isHighContrast } = useAccessibility();
  const isDark = colorScheme === "dark";

  const colors = useMemo(() => {
    const baseColors = isDark ? Colors.dark : Colors.light;
    return isHighContrast
      ? { ...baseColors, ...(isDark ? HIGH_CONTRAST_DARK : HIGH_CONTRAST_LIGHT) }
      : baseColors;
  }, [isDark, isHighContrast]);

  return { isDark, colors, colorScheme };
}
