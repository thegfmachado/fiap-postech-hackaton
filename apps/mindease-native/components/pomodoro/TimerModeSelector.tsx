import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { TimerMode } from "@/hooks/usePomodoroTimer";

interface TimerModeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface TimerModeSelectorProps {
  timerMode: TimerMode;
  isRunning: boolean;
  config: Record<TimerMode, TimerModeConfig>;
  onChangeMode: (mode: TimerMode) => void;
}

export function TimerModeSelector({
  timerMode,
  isRunning,
  config,
  onChangeMode,
}: TimerModeSelectorProps) {
  return (
    <View className="flex-row mx-6 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {(["work", "break", "longBreak"] as const).map((m) => (
        <TouchableOpacity
          key={m}
          onPress={() => onChangeMode(m)}
          disabled={isRunning}
          className={`flex-1 py-2 rounded-lg items-center ${
            timerMode === m
              ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              : ""
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              timerMode === m
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400"
            }`}
          >
            {config[m].label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
