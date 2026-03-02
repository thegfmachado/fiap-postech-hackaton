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
import { Task, Status, Priority, ChecklistItem } from "@mindease/models";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { usePomodoroSettingsContext } from "@/contexts/pomodoro-settings-context";
import { useTasks } from "@/contexts/tasks-context";
import { useAppColors } from "@/hooks/useAppColors";
import { useAccessibility } from "@/contexts/accessibility-context";
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
  const [newChecklistItemText, setNewChecklistItemText] = useState("");
  const { settings: { work: sessionMinutes } } = usePomodoroSettingsContext();
  const { toggleChecklistItem, addChecklistItem, removeChecklistItem, updateChecklistItem } = useTasks();
  const { isDark, colors } = useAppColors();
  const { fontScale, spacingScale, isHighContrast } = useAccessibility();
  const priorityConfig = getPriorityConfig(isDark);

  React.useEffect(() => {
    setEditedTask(task);
    setIsEditing(false);
    setNewChecklistItemText("");
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

  const handleSave = async () => {
    const originalItems = task.checklistItems ?? [];
    const editedItems = editedTask.checklistItems ?? [];

    for (const original of originalItems) {
      if (!editedItems.some((i) => i.id === original.id)) {
        await removeChecklistItem(task.id, original.id);
      }
    }

    for (const item of editedItems) {
      // Novo item
      if (item.id.startsWith("temp-")) {
        await addChecklistItem(task.id, item.description);
        continue;
      }

      const original = originalItems.find((i) => i.id === item.id);
      if (!original) continue;

      const changes: { description?: string; completed?: boolean } = {};

      if (original.description !== item.description) {
        changes.description = item.description;
      }

      if (original.completed !== item.completed) {
        changes.completed = item.completed;
      }

      if (Object.keys(changes).length) {
        await updateChecklistItem(task.id, item.id, changes);
      }
    }

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

          <ScrollView
            className="flex-1"
            style={{ paddingHorizontal: 24 * spacingScale, paddingTop: 24 * spacingScale }}
            contentContainerStyle={{ paddingBottom: 40 * spacingScale }}
          >
            <View style={{ marginBottom: 20 * spacingScale }}>
              <Text className="text-sm font-semibold" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.mutedForeground }}>Título</Text>
              {isEditing ? (
                <TextInput
                  value={editedTask.title}
                  onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
                  className="border-2 border-primary rounded-lg dark:bg-gray-800"
                  style={{ paddingHorizontal: 16 * spacingScale, paddingVertical: 12 * spacingScale, fontSize: 16 * fontScale, color: colors.text }}
                />
              ) : (
                <Text className="text-xl font-bold" style={{ fontSize: 20 * fontScale, color: colors.text }}>{task.title}</Text>
              )}
            </View>

            <View style={{ marginBottom: 20 * spacingScale }}>
              <Text className="text-sm font-semibold" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.mutedForeground }}>Descrição</Text>
              {isEditing ? (
                <TextInput
                  value={editedTask.description || ""}
                  onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="border-2 border-primary rounded-lg dark:bg-gray-800 min-h-[80px]"
                  style={{ paddingHorizontal: 16 * spacingScale, paddingVertical: 12 * spacingScale, fontSize: 16 * fontScale, color: colors.text }}
                  placeholder="Adicione uma descrição..."
                  placeholderTextColor={colors.grayLight}
                />
              ) : (
                <Text style={{ fontSize: 16 * fontScale, color: colors.mutedForeground }}>
                  {task.description || "Sem descrição"}
                </Text>
              )}
            </View>

            <View className="flex-row" style={{ gap: 16 * spacingScale, marginBottom: 20 * spacingScale }}>
              <View className="flex-1">
                <Text className="text-sm font-semibold flex-row items-center" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.mutedForeground }}>
                  <MaterialIcons name="check-circle" size={14} color={colors.icon} />{" "}
                  Status
                </Text>
                {isEditing ? (
                  <View style={{ gap: 4 * spacingScale }}>
                    {Object.values(Status).map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setEditedTask({ ...editedTask, status: s })}
                        className={`rounded-lg border ${
                          editedTask.status === s
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                        style={{ paddingVertical: 8 * spacingScale, paddingHorizontal: 12 * spacingScale, ...(isHighContrast && editedTask.status !== s ? { borderColor: colors.border } : {}) }}
                      >
                        <Text
                          className="text-sm"
                          style={{ fontSize: 14 * fontScale, color: editedTask.status === s ? colors.primary : colors.mutedForeground, fontWeight: editedTask.status === s ? "600" : "400" }}
                        >
                          {statusLabels[s]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={{ fontSize: 16 * fontScale, color: colors.text }}>{statusLabels[task.status]}</Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold" style={{ fontSize: 14 * fontScale, marginBottom: 8 * spacingScale, color: colors.mutedForeground }}>
                  <MaterialIcons name="label" size={14} color={colors.icon} />{" "}
                  Prioridade
                </Text>
                {isEditing ? (
                  <View style={{ gap: 4 * spacingScale }}>
                    {Object.values(Priority).map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setEditedTask({ ...editedTask, priority: p })}
                        className={`rounded-lg border ${
                          editedTask.priority === p
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 dark:border-gray-600"
                        }`}
                        style={{ paddingVertical: 8 * spacingScale, paddingHorizontal: 12 * spacingScale, ...(isHighContrast && editedTask.priority !== p ? { borderColor: colors.border } : {}) }}
                      >
                        <Text
                          className="text-sm"
                          style={{ fontSize: 14 * fontScale, color: editedTask.priority === p ? colors.primary : colors.mutedForeground, fontWeight: editedTask.priority === p ? "600" : "400" }}
                        >
                          {priorityConfig[p].label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View
                    className="self-start rounded-full"
                    style={{
                      backgroundColor: priorityConfig[task.priority].bg,
                      borderColor: priorityConfig[task.priority].border,
                      borderWidth: 1,
                      paddingHorizontal: 12 * spacingScale,
                      paddingVertical: 4 * spacingScale,
                    }}
                  >
                    <Text style={{ color: priorityConfig[task.priority].text, fontSize: 13 * fontScale, fontWeight: "600" }}>
                      {priorityConfig[task.priority].label}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ marginBottom: 20 * spacingScale }}>
              <Text className="text-sm font-semibold" style={{ fontSize: 14 * fontScale, marginBottom: 12 * spacingScale, color: colors.mutedForeground }}>
                <MaterialIcons name="timer" size={14} color={colors.icon} />{" "}
                Pomodoros
              </Text>

              <View className="flex-row items-center justify-between" style={{ marginBottom: 8 * spacingScale }}>
                <Text style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>Estimados</Text>
                {isEditing ? (
                  <View className="flex-row items-center" style={{ gap: 8 * spacingScale }}>
                    <TouchableOpacity
                      onPress={() => {
                        const newEst = Math.max(1, editedTask.estimatedPomodoros - 1);
                        const newComp = Math.min(editedTask.completedPomodoros, newEst);
                        updatePomodoros(newComp, newEst);
                      }}
                      className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                      style={isHighContrast ? { borderColor: colors.border } : undefined}
                    >
                      <Text className="font-bold" style={{ color: colors.mutedForeground }}>-</Text>
                    </TouchableOpacity>
                    <Text className="font-semibold w-8 text-center" style={{ fontSize: 14 * fontScale, color: colors.text }}>{editedTask.estimatedPomodoros}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newEst = Math.min(10, editedTask.estimatedPomodoros + 1);
                        updatePomodoros(editedTask.completedPomodoros, newEst);
                      }}
                      className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                      style={isHighContrast ? { borderColor: colors.border } : undefined}
                    >
                      <Text className="font-bold" style={{ color: colors.mutedForeground }}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.text }}>{task.estimatedPomodoros}</Text>
                )}
              </View>

              <View className="flex-row items-center justify-between" style={{ marginBottom: 12 * spacingScale }}>
                <Text style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>Completados</Text>
                {isEditing ? (
                  <View className="flex-row items-center" style={{ gap: 8 * spacingScale }}>
                    <TouchableOpacity
                      onPress={() => {
                        const newComp = Math.max(0, editedTask.completedPomodoros - 1);
                        updatePomodoros(newComp, editedTask.estimatedPomodoros);
                      }}
                      disabled={editedTask.completedPomodoros === 0}
                      className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                      style={isHighContrast ? { borderColor: colors.border } : undefined}
                    >
                      <Text className="font-bold" style={{ color: colors.mutedForeground }}>-</Text>
                    </TouchableOpacity>
                    <Text className="font-semibold w-8 text-center" style={{ fontSize: 14 * fontScale, color: colors.text }}>
                      {editedTask.completedPomodoros}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const newComp = Math.min(editedTask.estimatedPomodoros, editedTask.completedPomodoros + 1);
                        updatePomodoros(newComp, editedTask.estimatedPomodoros);
                      }}
                      disabled={editedTask.completedPomodoros >= editedTask.estimatedPomodoros}
                      className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 items-center justify-center"
                      style={isHighContrast ? { borderColor: colors.border } : undefined}
                    >
                      <Text className="font-bold" style={{ color: colors.mutedForeground }}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.text }}>{task.completedPomodoros}</Text>
                )}
              </View>

              <ProgressBar percent={progressPercent} />
              <View className="flex-row items-center justify-between">
                <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
                  {(isEditing ? editedTask : task).completedPomodoros * sessionMinutes}min / {(isEditing ? editedTask : task).estimatedPomodoros * sessionMinutes}min
                </Text>
                <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>{progressPercent}% completo</Text>
              </View>
            </View>

            {((task.checklistItems && task.checklistItems.length > 0) || isEditing) && (
              <View style={{ marginBottom: 20 * spacingScale }}>
                <View className="flex-row items-center justify-between" style={{ marginBottom: 8 * spacingScale }}>
                  <Text className="text-sm font-semibold" style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>
                    <MaterialIcons name="checklist" size={14} color={colors.icon} />{" "}
                    Checklist
                  </Text>
                  {isEditing && editedTask.checklistItems && editedTask.checklistItems.length > 0 && (
                    <Text style={{ fontSize: 12 * fontScale, color: colors.mutedForeground }}>
                      {editedTask.checklistItems.filter((i) => i.completed).length}/{editedTask.checklistItems.length}
                    </Text>
                  )}
                </View>

                {isEditing ? (
                  <>
                    {editedTask.checklistItems?.map((item) => (
                      <View key={item.id} className="flex-row items-center gap-2" style={{ marginBottom: 8 * spacingScale }}>
                        <TouchableOpacity
                          onPress={() => {
                            setEditedTask((prev) => ({
                              ...prev,
                              checklistItems: prev.checklistItems?.map((i) =>
                                i.id === item.id ? { ...i, completed: !i.completed } : i
                              ),
                            }));
                          }}
                          className="p-1"
                        >
                          <MaterialIcons
                            name={item.completed ? "check-box" : "check-box-outline-blank"}
                            size={22}
                            color={item.completed ? colors.primary : colors.grayLight}
                          />
                        </TouchableOpacity>
                        <TextInput
                          value={item.description}
                          onChangeText={(text) => {
                            setEditedTask((prev) => ({
                              ...prev,
                              checklistItems: prev.checklistItems?.map((i) =>
                                i.id === item.id ? { ...i, description: text } : i
                              ),
                            }));
                          }}
                          className="flex-1 border-b border-gray-200 dark:border-gray-600 py-1"
                          style={{ fontSize: 16 * fontScale, color: colors.text }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setEditedTask((prev) => ({
                              ...prev,
                              checklistItems: prev.checklistItems?.filter((i) => i.id !== item.id),
                            }));
                          }}
                          className="p-1"
                        >
                          <MaterialIcons name="close" size={18} color={colors.destructive} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <View className="flex-row items-center gap-2" style={{ marginTop: 4 * spacingScale }}>
                      <TextInput
                        value={newChecklistItemText}
                        onChangeText={setNewChecklistItemText}
                        placeholder="Novo item..."
                        placeholderTextColor={colors.grayLight}
                        className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        style={{ paddingHorizontal: 12 * spacingScale, paddingVertical: 8 * spacingScale, fontSize: 14 * fontScale, color: colors.text }}
                        onSubmitEditing={() => {
                          const text = newChecklistItemText.trim();
                          if (!text) return;
                          const tempItem: ChecklistItem = {
                            id: `temp-${Date.now()}`,
                            description: text,
                            completed: false,
                          };
                          setEditedTask((prev) => ({
                            ...prev,
                            checklistItems: [...(prev.checklistItems ?? []), tempItem],
                          }));
                          setNewChecklistItemText("");
                        }}
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const text = newChecklistItemText.trim();
                          if (!text) return;
                          const tempItem: ChecklistItem = {
                            id: `temp-${Date.now()}`,
                            description: text,
                            completed: false,
                          };
                          setEditedTask((prev) => ({
                            ...prev,
                            checklistItems: [...(prev.checklistItems ?? []), tempItem],
                          }));
                          setNewChecklistItemText("");
                        }}
                        disabled={!newChecklistItemText.trim()}
                        className={`w-8 h-8 rounded-lg items-center justify-center ${
                          newChecklistItemText.trim() ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <MaterialIcons name="add" size={18} color={newChecklistItemText.trim() ? "#fff" : colors.grayLight} />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  task.checklistItems?.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => toggleChecklistItem(task.id, item.id, !item.completed)}
                      className="flex-row items-center gap-2"
                      style={{ paddingVertical: 4 * spacingScale, marginBottom: 4 * spacingScale }}
                    >
                      <MaterialIcons
                        name={item.completed ? "check-box" : "check-box-outline-blank"}
                        size={22}
                        color={item.completed ? colors.primary : colors.grayLight}
                      />
                      <Text
                        className={`flex-1 ${item.completed ? "line-through" : ""}`}
                        style={{ fontSize: 16 * fontScale, color: item.completed ? colors.mutedForeground : colors.text }}
                      >
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </ScrollView>

          <View
            className="border-t border-gray-100 dark:border-gray-700"
            style={{ paddingHorizontal: 24 * spacingScale, paddingBottom: 40 * spacingScale, paddingTop: 16 * spacingScale, ...(isHighContrast ? { borderTopColor: colors.border } : {}) }}
          >
            {isEditing ? (
              <View className="flex-row" style={{ gap: 12 * spacingScale }}>
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 rounded-lg items-center border-2 border-gray-200 dark:border-gray-600"
                  style={{ paddingVertical: 12 * spacingScale, ...(isHighContrast ? { borderColor: colors.border } : {}) }}
                >
                  <Text className="font-semibold" style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 rounded-lg items-center bg-primary"
                  style={{ paddingVertical: 12 * spacingScale }}
                >
                  <Text className="font-semibold text-white" style={{ fontSize: 14 * fontScale }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row" style={{ gap: 12 * spacingScale }}>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="flex-1 rounded-lg items-center bg-primary"
                  style={{ paddingVertical: 12 * spacingScale }}
                >
                  <Text className="font-semibold text-white" style={{ fontSize: 14 * fontScale }}>Editar</Text>
                </TouchableOpacity>
                {onDelete && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    className="flex-1 rounded-lg items-center border-2 border-red-400"
                    style={{ paddingVertical: 12 * spacingScale }}
                  >
                    <Text className="font-semibold text-red-500" style={{ fontSize: 14 * fontScale }}>Deletar</Text>
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
