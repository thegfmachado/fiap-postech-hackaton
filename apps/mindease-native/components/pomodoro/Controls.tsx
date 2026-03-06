import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";

interface ControlsProps {
  isRunning: boolean;
  isTaskComplete: boolean;
  canStart: boolean;
  sessionsCompleted: number;
  accentColor: string;
  onToggle: () => void;
  onReset: () => void;
  onStop: () => void;
}

export function Controls({
  isRunning,
  isTaskComplete,
  canStart,
  sessionsCompleted,
  accentColor,
  onToggle,
  onReset,
  onStop,
}: ControlsProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <View className="flex-row items-center" style={{ gap: 12 * spacingScale, marginTop: 24 * spacingScale }}>
      {(isRunning || sessionsCompleted > 0) && (
        <TouchableOpacity
          onPress={onStop}
          className="w-12 h-12 rounded-2xl items-center justify-center border-2 border-red-300"
          accessibilityLabel="Parar sessão"
        >
          <MaterialIcons name="stop" size={22} color={colors.destructive} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onToggle}
        disabled={!canStart || isTaskComplete}
        className={`rounded-2xl flex-row items-center ${
          !canStart || isTaskComplete ? "opacity-50" : ""
        }`}
        style={{
          paddingHorizontal: 32 * spacingScale,
          paddingVertical: 14 * spacingScale,
          backgroundColor: accentColor,
          gap: 6 * spacingScale,
        }}
      >
        <MaterialIcons
          name={isRunning ? "pause" : "play-arrow"}
          size={22}
          color="#FFF"
        />
        <Text className="text-white font-bold" style={{ fontSize: 14 * fontScale }}>
          {isRunning ? "Pausar" : isTaskComplete ? "Concluído" : "Iniciar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReset}
        className="w-12 h-12 rounded-2xl items-center justify-center border-2 border-gray-200 dark:border-gray-600"
        style={isHighContrast ? { borderColor: colors.border } : undefined}
        accessibilityLabel="Reiniciar timer"
      >
        <MaterialIcons
          name="replay"
          size={22}
          color={colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
}
