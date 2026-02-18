import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

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

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-2xl border-2 ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
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
          <Text className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 leading-4">
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
