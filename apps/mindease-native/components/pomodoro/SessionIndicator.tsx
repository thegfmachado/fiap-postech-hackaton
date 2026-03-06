import React from "react";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import type { PomodoroMode, PomodoroSettings } from "@/hooks/usePomodoroTimer";

interface SessionIndicatorProps {
  pomodoroMode: PomodoroMode;
  sessionsCompleted: number;
  targetPomodoros: number;
  settings: PomodoroSettings;
}

export function SessionIndicator({
  pomodoroMode,
  sessionsCompleted,
  targetPomodoros,
  settings,
}: SessionIndicatorProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  const isTaskMode = pomodoroMode === "task" && targetPomodoros > 0;
  const count = isTaskMode
    ? targetPomodoros
    : settings.sessionsBeforeLongBreak;

  const isCompleted = (index: number) =>
    isTaskMode
      ? index < sessionsCompleted
      : index < sessionsCompleted % settings.sessionsBeforeLongBreak;

  return (
    <View className="items-center" style={{ marginTop: 24 * spacingScale, paddingHorizontal: 24 * spacingScale }}>
      <Text
        className="font-semibold"
        style={{ fontSize: 14 * fontScale, marginBottom: 12 * spacingScale, color: colors.text }}
      >
        {isTaskMode ? "Progresso da Tarefa" : "Sessões Completadas"}
      </Text>

      <View className="flex-row flex-wrap justify-center" style={{ gap: 8 * spacingScale }}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            className={`w-9 h-9 rounded-full border-2 items-center justify-center ${
              isCompleted(i)
                ? "bg-primary border-primary"
                : "border-gray-200 dark:border-gray-600"
            }`}
            style={isHighContrast && !isCompleted(i) ? { borderColor: colors.border } : undefined}
          >
            {isTaskMode && isCompleted(i) ? (
              <MaterialIcons name="check" size={16} color="#FFF" />
            ) : (
              <Text
                className={`font-semibold ${isCompleted(i) ? "text-white" : ""}`}
                style={{ fontSize: 12 * fontScale, ...(isCompleted(i) ? {} : { color: colors.mutedForeground }) }}
              >
                {i + 1}
              </Text>
            )}
          </View>
        ))}
      </View>

      <Text
        style={{ fontSize: 12 * fontScale, marginTop: 8 * spacingScale, color: colors.mutedForeground }}
      >
        Total: {sessionsCompleted} pomodoro
        {sessionsCompleted !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}
