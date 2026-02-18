import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

/**
 * Returns the current color scheme and the matching color palette.
 * Replaces the repetitive pattern:
 *   const { colorScheme } = useColorScheme();
 *   const isDark = colorScheme === "dark";
 *   const colors = isDark ? Colors.dark : Colors.light;
 */
export function useAppColors() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  return { isDark, colors, colorScheme } as const;
}
