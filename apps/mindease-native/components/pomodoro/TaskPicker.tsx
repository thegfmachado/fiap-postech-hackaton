import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task } from "@mindease/models";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { getPriorityConfig } from "@/constants/priority";

interface TaskPickerProps {
  visible: boolean;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStartFree: () => void;
  onClose: () => void;
}

export function TaskPicker({
  visible,
  tasks,
  onSelectTask,
  onStartFree,
  onClose,
}: TaskPickerProps) {
  const { isDark, colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const primaryColor = colors.primary;
  const priorityConfig = getPriorityConfig(isDark);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ModalHeader title="Selecionar Tarefa" onClose={onClose} />

        <ScrollView
          className="flex-1"
          style={{ paddingHorizontal: 24 * spacingScale, paddingTop: 16 * spacingScale }}
        >
          {tasks.length === 0 ? (
            <View className="items-center justify-center" style={{ paddingVertical: 64 * spacingScale }}>
              <MaterialIcons name="inbox" size={48} color={colors.grayLight} />
              <Text
                className="font-medium"
                style={{ fontSize: 16 * fontScale, marginTop: 12 * spacingScale, color: colors.mutedForeground }}
              >
                Nenhuma tarefa disponível
              </Text>
              <Text
                className="text-center"
                style={{ fontSize: 14 * fontScale, marginTop: 4 * spacingScale, color: colors.mutedForeground }}
              >
                Crie tarefas na aba Tarefas para vinculá-las ao Pomodoro
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => onSelectTask(task)}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 active:bg-gray-100"
                style={{ padding: 16 * spacingScale, marginBottom: 8 * spacingScale, ...(isHighContrast ? { borderColor: colors.border, borderWidth: 2 } : {}) }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1" style={{ marginRight: 12 * spacingScale }}>
                    <Text
                      className="font-bold"
                      numberOfLines={1}
                      style={{ fontSize: 14 * fontScale, color: colors.text }}
                    >
                      {task.title}
                    </Text>
                    {task.description ? (
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12 * fontScale, marginTop: 2 * spacingScale, color: colors.mutedForeground }}
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center" style={{ gap: 4 * spacingScale }}>
                      <MaterialIcons
                        name="timer"
                        size={14}
                        color={primaryColor}
                      />
                      <Text className="font-semibold" style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
                        {task.completedPomodoros}/{task.estimatedPomodoros}
                      </Text>
                    </View>
                    <View
                      className="w-2 h-2 rounded-full"
                      style={{
                        marginTop: 4 * spacingScale,
                        backgroundColor: priorityConfig[task.priority]?.bg || "#9CA3AF",
                      }}
                    />
                  </View>
                </View>

                <View
                  className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
                  style={{ marginTop: 8 * spacingScale }}
                >
                  <View
                    className="h-1 rounded-full"
                    style={{
                      width: `${
                        task.estimatedPomodoros > 0
                          ? (task.completedPomodoros / task.estimatedPomodoros) * 100
                          : 0
                      }%`,
                      backgroundColor: primaryColor,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View
          className="border-t border-gray-100 dark:border-gray-700"
          style={{ paddingHorizontal: 24 * spacingScale, paddingBottom: 24 * spacingScale, paddingTop: 12 * spacingScale, ...(isHighContrast ? { borderTopColor: colors.border } : {}) }}
        >
          <TouchableOpacity
            onPress={onStartFree}
            className="rounded-xl items-center border-2 border-gray-200 dark:border-gray-600 flex-row justify-center"
            style={{ paddingVertical: 12 * spacingScale, gap: 8 * spacingScale, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
          >
            <MaterialIcons name="all-inclusive" size={18} color={colors.icon} />
            <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.text }}>
              Usar modo livre
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
