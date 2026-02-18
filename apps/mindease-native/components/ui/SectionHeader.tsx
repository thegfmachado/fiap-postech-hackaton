import React from "react";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

interface SectionHeaderProps {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  const { colors } = useAppColors();

  return (
    <View className="flex-row items-center gap-2 mb-4">
      <MaterialIcons name={icon} size={20} color={colors.primary} />
      <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
        {title}
      </Text>
    </View>
  );
}
