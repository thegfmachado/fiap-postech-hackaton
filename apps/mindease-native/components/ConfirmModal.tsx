import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  infoOnly?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onCancel,
  infoOnly = false,
}: ConfirmModalProps) {
  const { isDark, colors } = useAppColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="bg-white dark:bg-gray-800 rounded-2xl mx-8 w-full max-w-sm overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          <View className="px-6 pt-6 pb-2 items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mb-3"
              style={{
                backgroundColor: destructive
                  ? (isDark ? "#3B1A14" : "#FFE7D7")
                  : (isDark ? "#0D3B2F" : "#D8FAF0"),
              }}
            >
              <MaterialIcons
                name={destructive ? "warning" : "info-outline"}
                size={24}
                color={destructive ? colors.destructive : colors.primary}
              />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 text-center">
              {title}
            </Text>
          </View>

          <View className="px-6 pb-6 pt-2">
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center leading-5">
              {message}
            </Text>
          </View>

          <View className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            {infoOnly ? (
              <TouchableOpacity
                onPress={onConfirm}
                className="py-3 rounded-xl items-center bg-primary"
                accessibilityLabel="Fechar"
              >
                <Text className="font-semibold text-white text-sm">{confirmLabel}</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-3 rounded-xl items-center border-2 border-gray-200 dark:border-gray-600"
                >
                  <Text className="font-semibold text-gray-600 dark:text-gray-300 text-sm">
                    {cancelLabel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: destructive ? colors.destructive : colors.primary,
                  }}
                >
                  <Text className="font-semibold text-white text-sm">
                    {confirmLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
