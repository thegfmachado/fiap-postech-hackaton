import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task } from "@mindease/models";
import { useAppColors } from "@/hooks/useAppColors";
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
  const primaryColor = colors.primary;
  const priorityConfig = getPriorityConfig(isDark);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ModalHeader title="Selecionar Tarefa" onClose={onClose} />

        <ScrollView className="flex-1 px-6 pt-4">
          {tasks.length === 0 ? (
            <View className="items-center justify-center py-16">
              <MaterialIcons name="inbox" size={48} color={colors.grayLight} />
              <Text className="text-base text-gray-400 mt-3 font-medium">
                Nenhuma tarefa disponível
              </Text>
              <Text className="text-sm text-gray-300 dark:text-gray-500 mt-1 text-center">
                Crie tarefas na aba Tarefas para vinculá-las ao Pomodoro
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => onSelectTask(task)}
                className="p-4 mb-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 active:bg-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className="text-sm font-bold text-gray-900 dark:text-gray-100"
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                    {task.description ? (
                      <Text
                        className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                        numberOfLines={1}
                      >
                        {task.description}
                      </Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons
                        name="timer"
                        size={14}
                        color={primaryColor}
                      />
                      <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {task.completedPomodoros}/{task.estimatedPomodoros}
                      </Text>
                    </View>
                    <View
                      className="w-2 h-2 rounded-full mt-1"
                      style={{
                        backgroundColor:
                          priorityConfig[task.priority]?.bg || "#9CA3AF",
                      }}
                    />
                  </View>
                </View>

                <View className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-2 overflow-hidden">
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

        <View className="px-6 pb-6 pt-3 border-t border-gray-100 dark:border-gray-700">
          <TouchableOpacity
            onPress={onStartFree}
            className="py-3 rounded-xl items-center border-2 border-gray-200 dark:border-gray-600 flex-row justify-center gap-2"
          >
            <MaterialIcons name="all-inclusive" size={18} color={colors.icon} />
            <Text className="font-semibold text-gray-600 dark:text-gray-300">
              Usar modo livre
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
