import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { Task } from "@mindease/models";
import { getPriorityConfig } from "@/constants/priority";

interface TaskCardProps {
  task: Task;
  sessionsCompleted: number;
  targetPomodoros: number;
  isTaskComplete: boolean;
  isRunning: boolean;
  onDetach: () => void;
}

export function TaskCard({
  task,
  sessionsCompleted,
  targetPomodoros,
  isTaskComplete,
  isRunning,
  onDetach,
}: TaskCardProps) {
  const { isDark, colors } = useAppColors();
  const primaryColor = colors.primary;
  const priorityConfig = getPriorityConfig(isDark);

  return (
    <View className="mx-6 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-2">
          <Text
            className="text-sm font-bold text-gray-900 dark:text-gray-100"
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: priorityConfig[task.priority]?.bg || "#9CA3AF",
              }}
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {sessionsCompleted}/{targetPomodoros} pomodoros
            </Text>
            {isTaskComplete && (
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-green-700">
                  ✓ Concluída
                </Text>
              </View>
            )}
          </View>
        </View>
        {!isRunning && (
          <TouchableOpacity
            onPress={onDetach}
            className="p-1.5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Desvincular tarefa"
          >
            <MaterialIcons name="close" size={18} color={colors.grayLight} />
          </TouchableOpacity>
        )}
      </View>

      <View className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
        <View
          className="h-1.5 rounded-full"
          style={{
            width: `${
              targetPomodoros > 0
                ? Math.min(100, (sessionsCompleted / targetPomodoros) * 100)
                : 0
            }%`,
            backgroundColor: primaryColor,
          }}
        />
      </View>
    </View>
  );
}
