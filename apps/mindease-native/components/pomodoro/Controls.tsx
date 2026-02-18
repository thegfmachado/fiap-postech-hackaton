import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";

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

  return (
    <View className="flex-row items-center gap-3 mt-6">
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
        disabled={!canStart}
        className={`px-8 py-3.5 rounded-2xl flex-row items-center ${
          !canStart ? "opacity-50" : ""
        }`}
        style={{ backgroundColor: accentColor }}
      >
        <MaterialIcons
          name={isRunning ? "pause" : "play-arrow"}
          size={22}
          color="#FFF"
        />
        <Text className="text-white font-bold text-sm ml-1.5">
          {isRunning ? "Pausar" : isTaskComplete ? "Concluído" : "Iniciar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReset}
        className="w-12 h-12 rounded-2xl items-center justify-center border-2 border-gray-200 dark:border-gray-600"
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
