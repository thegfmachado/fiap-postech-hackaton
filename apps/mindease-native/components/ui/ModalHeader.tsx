import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  safeTop?: boolean;
}

export function ModalHeader({ title, onClose, safeTop = false }: ModalHeaderProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale } = useAccessibility();

  return (
    <View
      className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700"
      style={{
        paddingHorizontal: 24 * spacingScale,
        paddingBottom: 16 * spacingScale,
        paddingTop: safeTop ? 64 * spacingScale : 16 * spacingScale,
      }}
    >
      <Text
        className="flex-1 font-bold text-gray-900 dark:text-gray-100"
        numberOfLines={1}
        style={{ fontSize: 18 * fontScale, marginRight: 16 * spacingScale }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={{ padding: 4 * spacingScale }}
        accessibilityLabel="Fechar"
      >
        <MaterialIcons name="close" size={24} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}
