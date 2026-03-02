import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { Task } from "@mindease/models";
import { getPriorityConfig } from "@/constants/priority";
import { useDisplayMode } from "@/contexts/display-mode-context";
import { useTasks } from "@/contexts/tasks-context";
import { getChecklistProgress, getNextIncompleteItem } from "@mindease/utils";

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
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  const checklistProgress = hasChecklist ? getChecklistProgress(task) : null;

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
            {hasChecklist && (
              <Text className="text-xs text-gray-400">
                ✓ {checklistProgress!.completed}/{checklistProgress!.total}
              </Text>
            )}
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

export function TaskCardChecklist({ task }: { task: Task }) {
  const { colors } = useAppColors();
  const { isSimplified } = useDisplayMode();
  const { toggleChecklistItem } = useTasks();
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  if (!hasChecklist) return null;

  const checklistProgress = getChecklistProgress(task);
  const nextItem = getNextIncompleteItem(task);
  const allChecklistDone = checklistProgress.completed === checklistProgress.total;
  const lastCompletedItem = isSimplified
    ? [...(task.checklistItems ?? [])].reverse().find((i) => i.completed)
    : null;

  return (
    <View className="mx-6 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Checklist
        </Text>
        <Text className="text-xs text-gray-400">
          {checklistProgress.completed}/{checklistProgress.total}
        </Text>
      </View>

      {isSimplified ? (
        allChecklistDone ? (
          <View className="flex-row items-center gap-2 py-1">
            <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            <Text className="text-sm font-semibold text-primary">
              Todos os itens concluídos
            </Text>
          </View>
        ) : (
          <>
            {lastCompletedItem && (
              <TouchableOpacity
                onPress={() => toggleChecklistItem(task.id, lastCompletedItem.id, false)}
                className="flex-row items-center gap-2 py-1 opacity-60"
              >
                <MaterialIcons name="check-box" size={20} color={colors.primary} />
                <Text className="flex-1 text-sm text-gray-400 line-through">
                  {lastCompletedItem.description}
                </Text>
              </TouchableOpacity>
            )}
            {nextItem && (
              <TouchableOpacity
                onPress={() => toggleChecklistItem(task.id, nextItem.id, true)}
                className="flex-row items-center gap-2 py-1"
              >
                <MaterialIcons
                  name="check-box-outline-blank"
                  size={20}
                  color={colors.grayLight}
                />
                <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {nextItem.description}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )
      ) : (
        task.checklistItems!.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => toggleChecklistItem(task.id, item.id, !item.completed)}
            className="flex-row items-center gap-2 py-1"
          >
            <MaterialIcons
              name={item.completed ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={item.completed ? colors.primary : colors.grayLight}
            />
            <Text
              className={`flex-1 text-sm ${
                item.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
