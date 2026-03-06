import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
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
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const activeColor = colors.primary;

  return (
    <View
      className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl"
      style={{ marginHorizontal: 24 * spacingScale, marginBottom: 16 * spacingScale, padding: 4 * spacingScale }}
    >
      <TouchableOpacity
        onPress={onSelectTask}
        disabled={isRunning}
        className={`flex-1 rounded-lg items-center flex-row justify-center ${
          pomodoroMode === "task"
            ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            : ""
        }`}
        style={{ paddingVertical: 10 * spacingScale, gap: 4 * spacingScale, ...(isHighContrast && pomodoroMode === "task" ? { borderColor: colors.border } : {}) }}
      >
        <MaterialIcons
          name="task-alt"
          size={16}
          color={pomodoroMode === "task" ? activeColor : colors.grayLight}
        />
        <Text
          className="font-semibold"
          style={{ fontSize: 14 * fontScale, color: pomodoroMode === "task" ? colors.text : colors.mutedForeground }}
        >
          Com Tarefa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSelectFree}
        disabled={isRunning}
        className={`flex-1 rounded-lg items-center flex-row justify-center ${
          pomodoroMode === "free"
            ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            : ""
        }`}
        style={{ paddingVertical: 10 * spacingScale, gap: 4 * spacingScale, ...(isHighContrast && pomodoroMode === "free" ? { borderColor: colors.border } : {}) }}
      >
        <MaterialIcons
          name="all-inclusive"
          size={16}
          color={pomodoroMode === "free" ? activeColor : colors.grayLight}
        />
        <Text
          className="font-semibold"
          style={{ fontSize: 14 * fontScale, color: pomodoroMode === "free" ? colors.text : colors.mutedForeground }}
        >
          Livre
        </Text>
      </TouchableOpacity>
    </View>
  );
}
