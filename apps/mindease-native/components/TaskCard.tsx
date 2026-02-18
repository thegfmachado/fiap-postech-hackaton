import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task } from "@mindease/models";
import { useDisplayMode } from "@/contexts/display-mode-context";
import { ConfirmModal } from "@/components/ConfirmModal";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { useAppColors } from "@/hooks/useAppColors";
import { getPriorityConfig } from "@/constants/priority";

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onPress, onDelete }: TaskCardProps) {
  const { isSimplified } = useDisplayMode();
  const { isDark, colors } = useAppColors();
  const config = getPriorityConfig(isDark)[task.priority];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { work: sessionMinutes } = usePomodoroSettings();
  const elapsedMin = task.completedPomodoros * sessionMinutes;
  const totalMin = task.estimatedPomodoros * sessionMinutes;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(task)}
        className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 border border-gray-100 dark:border-gray-700"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
      <View className="flex-row items-center justify-between mb-1">
        <Text
          className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex-1 mr-2"
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {onDelete && (
          <TouchableOpacity
            onPress={() => {
              setShowDeleteConfirm(true);
            }}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Excluir tarefa"
          >
            <MaterialIcons name="delete-outline" size={18} color={colors.destructive} />
          </TouchableOpacity>
        )}
      </View>

      {!isSimplified && task.description ? (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2" numberOfLines={1}>
          {task.description}
        </Text>
      ) : null}

      <View className="flex-row items-center justify-between">
        <View
          className="px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: config.bg, borderColor: config.border, borderWidth: 1 }}
        >
          <Text style={{ color: config.text, fontSize: 10, fontWeight: "600" }}>
            {config.label}
          </Text>
        </View>

        {!isSimplified && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="timer" size={12} color={colors.grayLight} />
            <Text className="text-xs text-gray-400">
              {task.completedPomodoros}/{task.estimatedPomodoros} · {elapsedMin}min/{totalMin}min
            </Text>
          </View>
        )}
      </View>

      {isSimplified && task.estimatedPomodoros > 0 && (
        <View className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
          <View
            className="h-1.5 rounded-full"
            style={{
              width: `${Math.min(
                100,
                (task.completedPomodoros / task.estimatedPomodoros) * 100
              )}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      )}
    </TouchableOpacity>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Deletar tarefa"
        message={`Tem certeza que deseja deletar "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete?.(task.id);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
