import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Task, TaskToInsert } from "@mindease/models";
import { useTasks } from "@/contexts/tasks-context";
import { useAuth } from "@/contexts/auth-context";
import { TaskForm } from "@/components/TaskForm";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { Board } from "@/components/kanban/Board";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAppColors } from "@/hooks/useAppColors";

export default function HomeScreen() {
  const { colors } = useAppColors();
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    tasksByStatus,
    clearError,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleAddTask = async (data: TaskToInsert) => {
    try {
      await addTask(data);
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const firstName = user?.user_metadata?.name?.split(" ")[0] || "Usuário";

  if (loading && tasks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 dark:text-gray-400 mt-4">Carregando tarefas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <View className="px-6 pt-2 pb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Olá, {firstName} 👋
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Organize suas tarefas de forma visual
        </Text>
      </View>

      {error && (
        <ErrorBanner
          message={error}
          onDismiss={clearError}
          iconColor={colors.destructive}
        />
      )}

      <View className="px-6 mb-4">
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          className="bg-primary flex-row items-center justify-center py-3 rounded-xl"
        >
          <MaterialIcons name="add" size={20} color="#FFF" />
          <Text className="text-white font-semibold ml-2">Nova Tarefa</Text>
        </TouchableOpacity>
      </View>

      <Board
        tasksByStatus={tasksByStatus}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onTaskPress={(t) => setSelectedTask(t)}
        onTaskDelete={handleDeleteTask}
      />

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </SafeAreaView>
      </Modal>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </SafeAreaView>
  );
}
