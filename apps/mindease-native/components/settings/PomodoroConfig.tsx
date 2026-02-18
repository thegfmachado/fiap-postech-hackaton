import React from "react";
import { View, Text } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChipSelector } from "@/components/ui/ChipSelector";
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
  return (
    <View className="mx-6 mb-6">
      <SectionHeader icon="timer" title="Timer Pomodoro" />

      <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <View className="p-4 border-b border-gray-50 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tempo de Foco
          </Text>
          <ChipSelector
            options={workTimeOptions}
            selected={settings.work}
            onSelect={(min) => onUpdate({ ...settings, work: min })}
            scrollable
          />
        </View>

        <View className="p-4 border-b border-gray-50 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pausa Curta
          </Text>
          <ChipSelector
            options={breakTimeOptions}
            selected={settings.break}
            onSelect={(min) => onUpdate({ ...settings, break: min })}
          />
        </View>

        <View className="p-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Pausa Longa
          </Text>
          <ChipSelector
            options={longBreakOptions}
            selected={settings.longBreak}
            onSelect={(min) => onUpdate({ ...settings, longBreak: min })}
          />
        </View>
      </View>

      <View className="bg-primary/5 rounded-xl p-3 mt-3 border border-primary/10">
        <Text className="text-xs text-gray-600 dark:text-gray-300">
          <Text className="font-bold">Dica: </Text>
          A técnica Pomodoro tradicional usa 25 min de foco, 5 min de pausa
          curta e 15 min de pausa longa.
        </Text>
      </View>
    </View>
  );
}
