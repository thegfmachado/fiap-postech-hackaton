import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task, Status, Priority } from "@mindease/models";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { useAppColors } from "@/hooks/useAppColors";
import { getPriorityConfig } from "@/constants/priority";

interface TaskDetailsModalProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const statusLabels: Record<Status, string> = {
  [Status.todo]: "A Fazer",
  [Status.doing]: "Em Andamento",
  [Status.done]: "Concluído",
};

export function TaskDetailsModal({
  task,
  visible,
  onClose,
  onSave,
  onDelete,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { work: sessionMinutes } = usePomodoroSettings();
  const { isDark, colors } = useAppColors();
  const priorityConfig = getPriorityConfig(isDark);

  React.useEffect(() => {
    setEditedTask(task);
    setIsEditing(false);
  }, [task]);

  const deriveStatus = (completed: number, estimated: number): Status => {
    if (completed >= estimated && estimated > 0) return Status.done;
    if (completed > 0) return Status.doing;
    return Status.todo;
  };

  const updatePomodoros = (completed: number, estimated: number) => {
    const status = deriveStatus(completed, estimated);
    setEditedTask((prev) => ({ ...prev, completedPomodoros: completed, estimatedPomodoros: estimated, status }));
  };

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const progressPercent =
    editedTask.estimatedPomodoros > 0
      ? Math.min(100, Math.round((editedTask.completedPomodoros / editedTask.estimatedPomodoros) * 100))
      : 0;

  return (
    <>
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white dark:bg-gray-900">
        <ModalHeader title="Detalhes da Tarefa" onClose={onClose} safeTop />

        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Título</Text>
            {isEditing ? (
              <TextInput
                value={editedTask.title}
                onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
                className="border-2 border-primary rounded-lg px-4 py-3 text-base text-gray-900 dark:text-gray-100 dark:bg-gray-800"
              />
            ) : (
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{task.title}</Text>
            )}
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Descrição</Text>
            {isEditing ? (
              <TextInput
                value={editedTask.description || ""}
                onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="border-2 border-primary rounded-lg px-4 py-3 text-base text-gray-900 dark:text-gray-100 dark:bg-gray-800 min-h-[80px]"
                placeholder="Adicione uma descrição..."
                placeholderTextColor={colors.grayLight}
              />
            ) : (
              <Text className="text-base text-gray-600 dark:text-gray-300">
                {task.description || "Sem descrição"}
              </Text>
            )}
          </View>

          <View className="flex-row gap-4 mb-5">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex-row items-center">
                <MaterialIcons name="check-circle" size={14} color={colors.icon} />{" "}
                Status
              </Text>
              {isEditing ? (
                <View className="gap-1">
                  {Object.values(Status).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setEditedTask({ ...editedTask, status: s })}
                      className={`py-2 px-3 rounded-lg border ${
                        editedTask.status === s
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          editedTask.status === s ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {statusLabels[s]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-base text-gray-700 dark:text-gray-300">{statusLabels[task.status]}</Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                <MaterialIcons name="label" size={14} color={colors.icon} />{" "}
                Prioridade
              </Text>
              {isEditing ? (
                <View className="gap-1">
                  {Object.values(Priority).map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setEditedTask({ ...editedTask, priority: p })}
                      className={`py-2 px-3 rounded-lg border ${
                        editedTask.priority === p
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          editedTask.priority === p ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {priorityConfig[p].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View
                  className="self-start px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: priorityConfig[task.priority].bg,
                    borderColor: priorityConfig[task.priority].border,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: priorityConfig[task.priority].text, fontSize: 13, fontWeight: "600" }}>
                    {priorityConfig[task.priority].label}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              <MaterialIcons name="timer" size={14} color={colors.icon} />{" "}
              Pomodoros
            </Text>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Estimados</Text>
              {isEditing ? (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      const newEst = Math.max(1, editedTask.estimatedPomodoros - 1);
                      const newComp = Math.min(editedTask.completedPomodoros, newEst);
                      updatePomodoros(newComp, newEst);
                    }}
                    className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="font-semibold w-8 text-center dark:text-gray-100">{editedTask.estimatedPomodoros}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newEst = Math.min(10, editedTask.estimatedPomodoros + 1);
                      updatePomodoros(editedTask.completedPomodoros, newEst);
                    }}
                    className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="font-semibold text-gray-900 dark:text-gray-100">{task.estimatedPomodoros}</Text>
              )}
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Completados</Text>
              {isEditing ? (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      const newComp = Math.max(0, editedTask.completedPomodoros - 1);
                      updatePomodoros(newComp, editedTask.estimatedPomodoros);
                    }}
                    disabled={editedTask.completedPomodoros === 0}
                    className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-bold">-</Text>
                  </TouchableOpacity>
                  <Text className="font-semibold w-8 text-center dark:text-gray-100">
                    {editedTask.completedPomodoros}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newComp = Math.min(editedTask.estimatedPomodoros, editedTask.completedPomodoros + 1);
                      updatePomodoros(newComp, editedTask.estimatedPomodoros);
                    }}
                    disabled={editedTask.completedPomodoros >= editedTask.estimatedPomodoros}
                    className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="font-semibold text-gray-900 dark:text-gray-100">{task.completedPomodoros}</Text>
              )}
            </View>

            <ProgressBar percent={progressPercent} />
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-400">
                {(isEditing ? editedTask : task).completedPomodoros * sessionMinutes}min / {(isEditing ? editedTask : task).estimatedPomodoros * sessionMinutes}min
              </Text>
              <Text className="text-xs text-gray-400">{progressPercent}% completo</Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pb-10 pt-4 border-t border-gray-100 dark:border-gray-700">
          {isEditing ? (
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-1 py-3 rounded-lg items-center border-2 border-gray-200 dark:border-gray-600"
              >
                <Text className="font-semibold text-gray-600 dark:text-gray-300">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 py-3 rounded-lg items-center bg-primary"
              >
                <Text className="font-semibold text-white">Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="flex-1 py-3 rounded-lg items-center bg-primary"
              >
                <Text className="font-semibold text-white">Editar</Text>
              </TouchableOpacity>
              {onDelete && (
                <TouchableOpacity
                  onPress={handleDelete}
                  className="flex-1 py-3 rounded-lg items-center border-2 border-red-400"
                >
                  <Text className="font-semibold text-red-500">Deletar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>

    <ConfirmModal
      visible={showDeleteConfirm}
      title="Deletar tarefa"
      message="Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita."
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
