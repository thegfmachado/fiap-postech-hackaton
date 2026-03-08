import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Task, TaskToInsert, ChecklistItem, Status } from "@mindease/models";
import { taskService } from "@/lib/services/task-service";
import { useAuth } from "@/contexts/auth-context";

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskToInsert) => Promise<Task>;
  updateTask: (id: string, updates: Partial<TaskToInsert>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: Status) => Promise<Task>;
  toggleChecklistItem: (taskId: string, itemId: string, completed: boolean) => Promise<void>;
  addChecklistItem: (taskId: string, description: string) => Promise<ChecklistItem>;
  removeChecklistItem: (taskId: string, itemId: string) => Promise<void>;
  updateChecklistItemDescription: (taskId: string, itemId: string, description: string) => Promise<void>;
  updateChecklistItem: (taskId: string, itemId: string, updates: { description?: string; completed?: boolean }) => Promise<ChecklistItem>;
  tasksByStatus: Record<Status, Task[]>;
  clearError: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Erro ao carregar tarefas");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, fetchTasks]);

  const addTask = useCallback(async (task: TaskToInsert) => {
    try {
      const created = await taskService.create(task);
      setTasks((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError("Erro ao criar tarefa");
      console.error("Create task error:", err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<TaskToInsert>) => {
    try {
      const updated = await taskService.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return updated;
    } catch (err) {
      setError("Erro ao atualizar tarefa");
      console.error("Update task error:", err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Erro ao deletar tarefa");
      console.error("Delete task error:", err);
      throw err;
    }
  }, []);

  const moveTask = useCallback(async (id: string, newStatus: Status) => {
    return updateTask(id, { status: newStatus });
  }, [updateTask]);

  const toggleChecklistItem = useCallback(async (taskId: string, itemId: string, completed: boolean) => {
    try {
      await taskService.toggleChecklistItem(itemId, completed);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                checklistItems: t.checklistItems?.map((item) =>
                  item.id === itemId ? { ...item, completed } : item
                ),
              }
            : t
        )
      );
    } catch (err) {
      setError("Erro ao atualizar item do checklist");
      console.error("Toggle checklist item error:", err);
      throw err;
    }
  }, []);

  const addChecklistItem = useCallback(async (taskId: string, description: string) => {
    try {
      const newItem = await taskService.addChecklistItem(taskId, description);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, checklistItems: [...(t.checklistItems ?? []), newItem] }
            : t
        )
      );
      return newItem;
    } catch (err) {
      setError("Erro ao adicionar item ao checklist");
      console.error("Add checklist item error:", err);
      throw err;
    }
  }, []);

  const removeChecklistItem = useCallback(async (taskId: string, itemId: string) => {
    try {
      await taskService.removeChecklistItem(itemId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, checklistItems: t.checklistItems?.filter((item) => item.id !== itemId) }
            : t
        )
      );
    } catch (err) {
      setError("Erro ao remover item do checklist");
      console.error("Remove checklist item error:", err);
      throw err;
    }
  }, []);

  const updateChecklistItemDescription = useCallback(async (taskId: string, itemId: string, description: string) => {
    try {
      await taskService.updateChecklistItemDescription(itemId, description);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                checklistItems: t.checklistItems?.map((item) =>
                  item.id === itemId ? { ...item, description } : item
                ),
              }
            : t
        )
      );
    } catch (err) {
      setError("Erro ao atualizar item do checklist");
      console.error("Update checklist item description error:", err);
      throw err;
    }
  }, []);

  const updateChecklistItem = useCallback(async (taskId: string, itemId: string, updates: { description?: string; completed?: boolean }) => {
    try {
      const updated = await taskService.updateChecklistItem(itemId, updates);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                checklistItems: t.checklistItems?.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : t
        )
      );
      return updated;
    } catch (err) {
      setError("Erro ao atualizar item do checklist");
      console.error("Update checklist item error:", err);
      throw err;
    }
  }, []);

  const tasksByStatus = useMemo(() => ({
    [Status.todo]: tasks.filter((t) => t.status === Status.todo),
    [Status.doing]: tasks.filter((t) => t.status === Status.doing),
    [Status.done]: tasks.filter((t) => t.status === Status.done),
  }), [tasks]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleChecklistItem,
      addChecklistItem,
      removeChecklistItem,
      updateChecklistItemDescription,
      updateChecklistItem,
      tasksByStatus,
      clearError,
    }),
    [tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask, moveTask, toggleChecklistItem, addChecklistItem, removeChecklistItem, updateChecklistItemDescription, updateChecklistItem, tasksByStatus, clearError]
  );

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
