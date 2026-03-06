import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAccessibility } from "@/contexts/accessibility-context";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  iconColor?: string;
}

export function ErrorBanner({ message, onDismiss, iconColor = "#DB5141" }: ErrorBannerProps) {
  const { fontScale, spacingScale } = useAccessibility();

  return (
    <View
      className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl flex-row items-center justify-between"
      style={{
        marginHorizontal: 24 * spacingScale,
        marginBottom: 12 * spacingScale,
        paddingHorizontal: 16 * spacingScale,
        paddingVertical: 12 * spacingScale,
      }}
    >
      <View className="flex-1 flex-row items-center" style={{ gap: 8 * spacingScale }}>
        <MaterialIcons name="error-outline" size={18} color={iconColor} />
        <Text className="text-red-700 dark:text-red-300 flex-shrink" style={{ fontSize: 14 * fontScale }}>
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={8}>
        <MaterialIcons name="close" size={18} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
