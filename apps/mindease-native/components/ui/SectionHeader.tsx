import React from "react";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import type { MaterialIconName } from "@/types/icons";

interface SectionHeaderProps {
  icon: MaterialIconName;
  title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale } = useAccessibility();

  return (
    <View className="flex-row items-center" style={{ gap: 8 * spacingScale, marginBottom: 16 * spacingScale }}>
      <MaterialIcons name={icon} size={20} color={colors.primary} />
      <Text
        className="text-base font-bold text-gray-900 dark:text-gray-100"
        style={{ fontSize: 16 * fontScale, color: colors.text }}
      >
        {title}
      </Text>
    </View>
  );
}
