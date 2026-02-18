import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Priority, Status, TaskToInsert } from "@mindease/models";
import { useAppColors } from "@/hooks/useAppColors";

interface TaskFormProps {
  onSubmit: (task: TaskToInsert) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<TaskToInsert>;
}

const priorities: { value: Priority; label: string }[] = [
  { value: Priority.low, label: "Baixa" },
  { value: Priority.medium, label: "Média" },
  { value: Priority.high, label: "Alta" },
];

const MIN_POMODOROS = 1;
const MAX_POMODOROS = 10;

export function TaskForm({ onSubmit, onCancel, initialValues }: TaskFormProps) {
  const { colors } = useAppColors();
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [priority, setPriority] = useState<Priority>(initialValues?.priority || Priority.medium);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    initialValues?.estimatedPomodoros || 1
  );

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status: initialValues?.status || Status.todo,
      priority,
      estimatedPomodoros,
      completedPomodoros: initialValues?.completedPomodoros || 0,
    });
  };

  const adjustPomodoros = (delta: number) => {
    setEstimatedPomodoros((prev) => Math.max(MIN_POMODOROS, Math.min(MAX_POMODOROS, prev + delta)));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {initialValues ? "Editar Tarefa" : "Nova Tarefa"}
          </Text>
          <TouchableOpacity onPress={onCancel} className="p-1" accessibilityLabel="Fechar">
            <MaterialIcons name="close" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título da tarefa"
            placeholderTextColor={colors.grayLight}
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione uma descrição (opcional)"
            placeholderTextColor={colors.grayLight}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px]"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</Text>
          <View className="flex-row gap-2">
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPriority(p.value)}
                className={`flex-1 py-3 rounded-lg items-center border-2 ${
                  priority === p.value ? "border-primary bg-primary/10" : "border-gray-200 dark:border-gray-600"
                }`}
              >
                <Text
                  className={`font-medium text-sm ${
                    priority === p.value ? "text-primary" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pomodoros Estimados
          </Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => adjustPomodoros(-1)}
              disabled={estimatedPomodoros <= MIN_POMODOROS}
              className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${
                estimatedPomodoros <= MIN_POMODOROS ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" : "border-gray-200 dark:border-gray-600"
              }`}
            >
              <MaterialIcons
                name="remove"
                size={20}
                color={estimatedPomodoros <= MIN_POMODOROS ? colors.border : colors.icon}
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 w-10 text-center">
              {estimatedPomodoros}
            </Text>
            <TouchableOpacity
              onPress={() => adjustPomodoros(1)}
              disabled={estimatedPomodoros >= MAX_POMODOROS}
              className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${
                estimatedPomodoros >= MAX_POMODOROS ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" : "border-gray-200 dark:border-gray-600"
              }`}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={estimatedPomodoros >= MAX_POMODOROS ? colors.border : colors.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 py-3 rounded-lg items-center border-2 border-gray-200 dark:border-gray-600"
          >
            <Text className="font-semibold text-gray-600 dark:text-gray-300">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!title.trim()}
            className={`flex-1 py-3 rounded-lg items-center ${
              title.trim() ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <Text className="font-semibold text-white">
              {initialValues ? "Salvar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
