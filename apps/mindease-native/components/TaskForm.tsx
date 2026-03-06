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
import { useAccessibility } from "@/contexts/accessibility-context";

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
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
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
        contentContainerStyle={{ padding: 24 * spacingScale }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between" style={{ marginBottom: 24 * spacingScale }}>
          <Text className="text-xl font-bold" style={{ fontSize: 20 * fontScale, color: colors.text }}>
            {initialValues ? "Editar Tarefa" : "Nova Tarefa"}
          </Text>
          <TouchableOpacity onPress={onCancel} style={{ padding: 4 * spacingScale }} accessibilityLabel="Fechar">
            <MaterialIcons name="close" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 * spacingScale }}>
          <Text className="text-sm font-medium" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.text }}>Título *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título da tarefa"
            placeholderTextColor={colors.grayLight}
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            style={{ paddingHorizontal: 16 * spacingScale, paddingVertical: 12 * spacingScale, fontSize: 16 * fontScale, color: colors.text, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
          />
        </View>

        <View style={{ marginBottom: 16 * spacingScale }}>
          <Text className="text-sm font-medium" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.text }}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione uma descrição (opcional)"
            placeholderTextColor={colors.grayLight}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[80px]"
            style={{ paddingHorizontal: 16 * spacingScale, paddingVertical: 12 * spacingScale, fontSize: 16 * fontScale, color: colors.text, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
          />
        </View>

        <View style={{ marginBottom: 16 * spacingScale }}>
          <Text className="text-sm font-medium" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.text }}>Prioridade</Text>
          <View className="flex-row" style={{ gap: 8 * spacingScale }}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPriority(p.value)}
                className={`flex-1 rounded-lg items-center border-2 ${
                  priority === p.value ? "border-primary bg-primary/10" : "border-gray-200 dark:border-gray-600"
                }`}
                style={{ paddingVertical: 12 * spacingScale, ...(isHighContrast && priority !== p.value ? { borderColor: colors.border } : {}) }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ fontSize: 14 * fontScale, color: priority === p.value ? colors.primary : colors.mutedForeground }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 24 * spacingScale }}>
          <Text className="text-sm font-medium" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.text }}>
            Pomodoros Estimados
          </Text>
          <View className="flex-row items-center" style={{ gap: 16 * spacingScale }}>
            <TouchableOpacity
              onPress={() => adjustPomodoros(-1)}
              disabled={estimatedPomodoros <= MIN_POMODOROS}
              className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${
                estimatedPomodoros <= MIN_POMODOROS ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" : "border-gray-200 dark:border-gray-600"
              }`}
              style={isHighContrast && estimatedPomodoros > MIN_POMODOROS ? { borderColor: colors.border } : undefined}
            >
              <MaterialIcons
                name="remove"
                size={20}
                color={estimatedPomodoros <= MIN_POMODOROS ? colors.border : colors.icon}
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold w-10 text-center" style={{ fontSize: 24 * fontScale, color: colors.text }}>
              {estimatedPomodoros}
            </Text>
            <TouchableOpacity
              onPress={() => adjustPomodoros(1)}
              disabled={estimatedPomodoros >= MAX_POMODOROS}
              className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${
                estimatedPomodoros >= MAX_POMODOROS ? "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" : "border-gray-200 dark:border-gray-600"
              }`}
              style={isHighContrast && estimatedPomodoros < MAX_POMODOROS ? { borderColor: colors.border } : undefined}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={estimatedPomodoros >= MAX_POMODOROS ? colors.border : colors.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row" style={{ gap: 12 * spacingScale }}>
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 rounded-lg items-center border-2 border-gray-200 dark:border-gray-600"
            style={{ paddingVertical: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
          >
            <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!title.trim()}
            className={`flex-1 rounded-lg items-center ${
              title.trim() ? "bg-primary" : "bg-gray-300"
            }`}
            style={{ paddingVertical: 12 * spacingScale }}
          >
            <Text className="font-semibold text-white" style={{ fontSize: 14 * fontScale }}>
              {initialValues ? "Salvar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
