import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
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
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const primaryColor = colors.primary;
  const priorityConfig = getPriorityConfig(isDark);
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  const checklistProgress = hasChecklist ? getChecklistProgress(task) : null;

  return (
    <View
      className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
      style={{ marginHorizontal: 24 * spacingScale, marginBottom: 16 * spacingScale, padding: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : {}) }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1" style={{ marginRight: 8 * spacingScale }}>
          <Text
            className="font-bold text-gray-900 dark:text-gray-100"
            numberOfLines={1}
            style={{ fontSize: 14 * fontScale, color: colors.text }}
          >
            {task.title}
          </Text>
          <View className="flex-row items-center" style={{ gap: 8 * spacingScale, marginTop: 4 * spacingScale }}>
            <View
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: priorityConfig[task.priority]?.bg || "#9CA3AF",
              }}
            />
            <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
              {sessionsCompleted}/{targetPomodoros} pomodoros
            </Text>
            {hasChecklist && (
              <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
                ✓ {checklistProgress!.completed}/{checklistProgress!.total}
              </Text>
            )}
            {isTaskComplete && (
              <View
                className="bg-green-100 rounded-full"
                style={{ paddingHorizontal: 8 * spacingScale, paddingVertical: 2 * spacingScale }}
              >
                <Text className="font-semibold text-green-700" style={{ fontSize: 12 * fontScale }}>
                  ✓ Concluída
                </Text>
              </View>
            )}
          </View>
        </View>
        {!isRunning && (
          <TouchableOpacity
            onPress={onDetach}
            style={{ padding: 6 * spacingScale }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Desvincular tarefa"
          >
            <MaterialIcons name="close" size={18} color={colors.grayLight} />
          </TouchableOpacity>
        )}
      </View>

      <View
        className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
        style={{ marginTop: 8 * spacingScale }}
      >
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
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  if (!hasChecklist) return null;

  const checklistProgress = getChecklistProgress(task);
  const nextItem = getNextIncompleteItem(task);
  const allChecklistDone = checklistProgress.completed === checklistProgress.total;
  const lastCompletedItem = isSimplified
    ? [...(task.checklistItems ?? [])].reverse().find((i) => i.completed)
    : null;

  return (
    <View
      className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
      style={{ marginHorizontal: 24 * spacingScale, marginTop: 16 * spacingScale, padding: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : {}) }}
    >
      <View className="flex-row items-center justify-between" style={{ marginBottom: 8 * spacingScale }}>
        <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.text }}>
          Checklist
        </Text>
        <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
          {checklistProgress.completed}/{checklistProgress.total}
        </Text>
      </View>

      {isSimplified ? (
        allChecklistDone ? (
          <View className="flex-row items-center" style={{ gap: 8 * spacingScale, paddingVertical: 4 * spacingScale }}>
            <MaterialIcons name="check-circle" size={20} color={colors.primary} />
            <Text className="font-semibold" style={{ fontSize: 12 * fontScale, color: colors.primary }}>
              Todos os itens concluídos
            </Text>
          </View>
        ) : (
          <>
            {lastCompletedItem && (
              <TouchableOpacity
                onPress={() => toggleChecklistItem(task.id, lastCompletedItem.id, false)}
                className="flex-row items-center opacity-60"
                style={{ gap: 8 * spacingScale, paddingVertical: 4 * spacingScale }}
              >
                <MaterialIcons name="check-box" size={20} color={colors.primary} />
                <Text className="flex-1 line-through" style={{ fontSize: 12 * fontScale, color: colors.grayLight }}>
                  {lastCompletedItem.description}
                </Text>
              </TouchableOpacity>
            )}
            {nextItem && (
              <TouchableOpacity
                onPress={() => toggleChecklistItem(task.id, nextItem.id, true)}
                className="flex-row items-center"
                style={{ gap: 8 * spacingScale, paddingVertical: 4 * spacingScale }}
              >
                <MaterialIcons
                  name="check-box-outline-blank"
                  size={20}
                  color={colors.grayLight}
                />
                <Text className="flex-1" style={{ fontSize: 14 * fontScale, color: colors.text }}>
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
            className="flex-row items-center"
            style={{ gap: 8 * spacingScale, paddingVertical: 4 * spacingScale }}
          >
            <MaterialIcons
              name={item.completed ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={item.completed ? colors.primary : colors.grayLight}
            />
            <Text
              className={item.completed ? "flex-1 line-through" : "flex-1"}
              style={{ fontSize: 14 * fontScale, color: item.completed ? colors.mutedForeground : colors.text }}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
