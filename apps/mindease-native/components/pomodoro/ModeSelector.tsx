import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import type { PomodoroMode } from "@/hooks/usePomodoroTimer";

interface ModeSelectorProps {
  pomodoroMode: PomodoroMode;
  isRunning: boolean;
  onSelectTask: () => void;
  onSelectFree: () => void;
}

export function ModeSelector({
  pomodoroMode,
  isRunning,
  onSelectTask,
  onSelectFree,
}: ModeSelectorProps) {
  const { colors } = useAppColors();
  const activeColor = colors.primary;

  return (
    <View className="flex-row mx-6 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      <TouchableOpacity
        onPress={onSelectTask}
        disabled={isRunning}
        className={`flex-1 py-2.5 rounded-lg items-center flex-row justify-center gap-1 ${
          pomodoroMode === "task"
            ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            : ""
        }`}
      >
        <MaterialIcons
          name="task-alt"
          size={16}
          color={pomodoroMode === "task" ? activeColor : colors.grayLight}
        />
        <Text
          className={`text-sm font-semibold ${
            pomodoroMode === "task"
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400"
          }`}
        >
          Com Tarefa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSelectFree}
        disabled={isRunning}
        className={`flex-1 py-2.5 rounded-lg items-center flex-row justify-center gap-1 ${
          pomodoroMode === "free"
            ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            : ""
        }`}
      >
        <MaterialIcons
          name="all-inclusive"
          size={16}
          color={pomodoroMode === "free" ? activeColor : colors.grayLight}
        />
        <Text
          className={`text-sm font-semibold ${
            pomodoroMode === "free"
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400"
          }`}
        >
          Livre
        </Text>
      </TouchableOpacity>
    </View>
  );
}
