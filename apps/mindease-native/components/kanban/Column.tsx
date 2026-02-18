import React from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task, Status } from "@mindease/models";
import { TaskCard } from "@/components/TaskCard";
import { useAppColors } from "@/hooks/useAppColors";

const columnTitles: Record<Status, string> = {
  [Status.todo]: "A Fazer",
  [Status.doing]: "Em Andamento",
  [Status.done]: "Concluído",
};

const columnIcons: Record<Status, string> = {
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

  return (
    <>
      <View className="flex-row items-center justify-between mb-3 px-2">
        <View className="flex-row items-center gap-2">
          <MaterialIcons
            name={columnIcons[status] as any}
            size={20}
            color={colors.primary}
          />
          <Text className="text-base font-bold text-gray-800 dark:text-gray-200">
            {columnTitles[status]}
          </Text>
        </View>
        <View className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
          <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {tasks.length}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {tasks.length === 0 ? (
          <View className="items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <MaterialIcons name="inbox" size={36} color={colors.grayLight} />
            <Text className="text-sm text-gray-400 mt-2">Nenhuma tarefa</Text>
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
