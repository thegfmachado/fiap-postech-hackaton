import React from "react";
import { View, Text } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";

interface UserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserCardProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <View
      className="mx-6 bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center gap-4 border border-gray-100 dark:border-gray-700"
      style={[{ marginBottom: 24 * spacingScale }, isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : undefined]}
      style={isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : undefined}
    >
      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
        <Text className="text-white font-bold text-lg" style={{ fontSize: 18 * fontScale }}>
          {name?.[0]?.toUpperCase() || "U"}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          className="font-semibold text-gray-900 dark:text-gray-100"
          style={{ fontSize: 14 * fontScale, color: colors.text }}
        >
          {name || "Usuário"}
        </Text>
        <Text
          className="text-sm text-gray-500 dark:text-gray-400"
          style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}
        >
          {email}
        </Text>
      </View>
    </View>
  );
}
