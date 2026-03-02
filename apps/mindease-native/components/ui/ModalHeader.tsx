import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  safeTop?: boolean;
}

export function ModalHeader({ title, onClose, safeTop = false }: ModalHeaderProps) {
  const { colors } = useAppColors();

  return (
    <View
      className={`flex-row items-center justify-between px-6 pb-4 border-b border-gray-100 dark:border-gray-700 ${
        safeTop ? "pt-16" : "pt-4"
      }`}
    >
      <Text
        className="flex-1 mr-4 text-lg font-bold text-gray-900 dark:text-gray-100"
        numberOfLines={1}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        className="p-1"
        accessibilityLabel="Fechar"
      >
        <MaterialIcons name="close" size={24} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}
