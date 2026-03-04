import React from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task, Status } from "@mindease/models";
import { TaskCard } from "@/components/TaskCard";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import type { MaterialIconName } from "@/types/icons";

const columnTitles: Record<Status, string> = {
  [Status.todo]: "A Fazer",
  [Status.doing]: "Em Andamento",
  [Status.done]: "Concluído",
};

const columnIcons: Record<Status, MaterialIconName> = {
  [Status.todo]: "radio-button-unchecked",
  [Status.doing]: "pending",
  [Status.done]: "check-circle",
};

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function Column({ status, tasks, onTaskPress, onTaskDelete }: ColumnProps) {
  const { colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();

  return (
    <>
      <View className="flex-row items-center justify-between px-2" style={{ marginBottom: 12 * spacingScale }}>
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name={columnIcons[status]}
            size={20}
            color={colors.primary}
          />
          <Text
            className="text-base font-bold text-gray-800 dark:text-gray-200"
            style={{ fontSize: 16 * fontScale, color: colors.text }}
          >
            {columnTitles[status]}
          </Text>
        </View>
        <View className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
          <Text
            className="text-xs font-semibold text-gray-600 dark:text-gray-300"
            style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}
          >
            {tasks.length}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 20 * spacingScale }}
      >
        {tasks.length === 0 ? (
          <View
            className="items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700"
            style={isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : undefined}
          >
            <MaterialIcons name="inbox" size={36} color={colors.grayLight} />
            <Text className="text-sm text-gray-400 mt-2" style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>Nenhuma tarefa</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={onTaskPress}
              onDelete={onTaskDelete}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}
