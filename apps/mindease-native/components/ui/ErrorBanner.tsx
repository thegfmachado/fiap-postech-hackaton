import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  iconColor?: string;
}

export function ErrorBanner({ message, onDismiss, iconColor = "#DB5141" }: ErrorBannerProps) {
  return (
    <View className="mx-6 mb-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl px-4 py-3 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center gap-2">
        <MaterialIcons name="error-outline" size={18} color={iconColor} />
        <Text className="text-red-700 dark:text-red-300 text-sm flex-shrink">
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={8}>
        <MaterialIcons name="close" size={18} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
