import React from "react";
import { View, Text } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChipSelector } from "@/components/ui/ChipSelector";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import type { PomodoroSettings } from "@/hooks/usePomodoroTimer";

const workTimeOptions = [15, 20, 25, 30, 45, 60];
const breakTimeOptions = [3, 5, 10, 15];
const longBreakOptions = [15, 20, 25, 30];

interface PomodoroConfigProps {
  settings: PomodoroSettings;
  onUpdate: (settings: PomodoroSettings) => void;
}

export function PomodoroConfig({
  settings,
  onUpdate,
}: PomodoroConfigProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <View className="mx-6" style={{ marginBottom: 24 * spacingScale }}>
      <SectionHeader icon="timer" title="Timer Pomodoro" />

      <View
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        style={isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : undefined}
      >
        <View
          className="border-b border-gray-50 dark:border-gray-700"
          style={{
            padding: 16 * spacingScale,
            ...(isHighContrast ? { borderBottomColor: colors.border } : {}),
          }}
        >
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Tempo de Foco
          </Text>
          <ChipSelector
            options={workTimeOptions}
            selected={settings.work}
            onSelect={(min) => onUpdate({ ...settings, work: min })}
            scrollable
          />
        </View>

        <View
          className="border-b border-gray-50 dark:border-gray-700"
          style={{
            padding: 16 * spacingScale,
            ...(isHighContrast ? { borderBottomColor: colors.border } : {}),
          }}
        >
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Pausa Curta
          </Text>
          <ChipSelector
            options={breakTimeOptions}
            selected={settings.break}
            onSelect={(min) => onUpdate({ ...settings, break: min })}
          />
        </View>

        <View style={{ padding: 16 * spacingScale }}>
          <Text
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{ fontSize: 14 * fontScale, color: colors.text, marginBottom: 12 * spacingScale }}
          >
            Pausa Longa
          </Text>
          <ChipSelector
            options={longBreakOptions}
            selected={settings.longBreak}
            onSelect={(min) => onUpdate({ ...settings, longBreak: min })}
          />
        </View>
      </View>

      <View
        className="bg-primary/5 rounded-xl border border-primary/10"
        style={{ padding: 12 * spacingScale, marginTop: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
      >
        <Text
          className="text-xs text-gray-600 dark:text-gray-300"
          style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}
        >
          <Text className="font-bold" style={{ color: colors.text }}>Dica: </Text>
          A técnica Pomodoro tradicional usa 25 min de foco, 5 min de pausa
          curta e 15 min de pausa longa.
        </Text>
      </View>
    </View>
  );
}
