import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
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
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <View
      className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl"
      style={{ marginHorizontal: 24 * spacingScale, marginBottom: 16 * spacingScale, padding: 4 * spacingScale }}
    >
      {(["work", "break", "longBreak"] as const).map((m) => (
        <TouchableOpacity
          key={m}
          onPress={() => onChangeMode(m)}
          disabled={isRunning}
          className={`flex-1 rounded-lg items-center ${
            timerMode === m
              ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              : ""
          }`}
          style={{ paddingVertical: 8 * spacingScale, ...(isHighContrast && timerMode === m ? { borderColor: colors.border } : {}) }}
        >
          <Text
            className="font-semibold"
            style={{ fontSize: 12 * fontScale, color: timerMode === m ? colors.text : colors.mutedForeground }}
          >
            {config[m].label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
