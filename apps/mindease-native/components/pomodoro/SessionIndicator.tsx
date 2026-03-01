import React from "react";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const isTaskMode = pomodoroMode === "task" && targetPomodoros > 0;
  const count = isTaskMode
    ? targetPomodoros
    : settings.sessionsBeforeLongBreak;

  const isCompleted = (index: number) =>
    isTaskMode
      ? index < sessionsCompleted
      : index < sessionsCompleted % settings.sessionsBeforeLongBreak;

  return (
    <View className="mt-6 items-center px-6">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {isTaskMode ? "Progresso da Tarefa" : "Sessões Completadas"}
      </Text>

      <View className="flex-row gap-2 flex-wrap justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            className={`w-9 h-9 rounded-full border-2 items-center justify-center ${
              isCompleted(i)
                ? "bg-primary border-primary"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >
            {isTaskMode && isCompleted(i) ? (
              <MaterialIcons name="check" size={16} color="#FFF" />
            ) : (
              <Text
                className={`font-semibold text-xs ${
                  isCompleted(i) ? "text-white" : "text-gray-400"
                }`}
              >
                {i + 1}
              </Text>
            )}
          </View>
        ))}
      </View>

      <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Total: {sessionsCompleted} pomodoro
        {sessionsCompleted !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}
