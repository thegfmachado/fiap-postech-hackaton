import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";

interface OptionCardProps {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export function OptionCard({
  icon,
  title,
  description,
  selected,
  onPress,
}: OptionCardProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-2xl border-2 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
      style={{
        padding: 16 * spacingScale,
        ...(isHighContrast && !selected ? { borderColor: colors.border } : {}),
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={`p-2 rounded-lg ${
            selected ? "bg-primary" : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          <MaterialIcons
            name={icon}
            size={20}
            color={selected ? "#FFF" : colors.icon}
          />
        </View>
        <View className="flex-1">
          <Text
            className="font-semibold text-gray-900 dark:text-gray-100 mb-1"
            style={{ fontSize: 14 * fontScale, color: colors.text }}
          >
            {title}
          </Text>
          <Text
            className="text-xs text-gray-500 dark:text-gray-400 leading-4"
            style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}
          >
            {description}
          </Text>
        </View>
        {selected && (
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
