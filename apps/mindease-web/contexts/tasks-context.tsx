"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ChecklistItem, Task, TaskToInsert } from "@mindease/models";
import { HTTPService } from "@mindease/services";

import { TasksService } from "@/client/services/task-service";
import { AuthContext } from "@/contexts/auth-context";

interface TasksContextType {
  tasks: Task[];
  isLoadingTasks: boolean;
  tasksError: unknown;
  refreshTasks: () => Promise<void>;
  createTask: (taskData: TaskToInsert) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<TaskToInsert>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  createChecklistItems: (taskId: string, descriptions: string[]) => Promise<ChecklistItem[]>;
  toggleChecklistItem: (taskId: string, itemId: string, completed: boolean) => Promise<ChecklistItem>;
  deleteChecklistItem: (taskId: string, itemId: string) => Promise<void>;
}

const httpService = new HTTPService();
const tasksService = new TasksService(httpService);

const TasksContext = createContext<TasksContextType | undefined>(undefined);

function mergeChecklistItems(current: ChecklistItem[] | undefined, incoming: ChecklistItem[]) {
  const mergedById = new Map<string, ChecklistItem>();

  for (const item of current ?? []) {
    mergedById.set(item.id, item);
  }

  for (const item of incoming) {
    mergedById.set(item.id, item);
  }

  return Array.from(mergedById.values());
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("TasksProvider must be used within an AuthProvider");
  }

  const { user, loading: isLoadingAuth } = auth;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState<unknown>(null);

  const refreshTasks = useCallback(async () => {
    if (isLoadingAuth) {
      return;
    }

    if (!user?.id) {
      setTasks([]);
      setTasksError(null);
      setIsLoadingTasks(false);
      return;
    }

    setIsLoadingTasks(true);
    setTasksError(null);

    try {
      const response = await tasksService.get();
      setTasks(response.data);
    } catch (err) {
      setTasksError(err);
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [isLoadingAuth, user?.id]);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const createTask = useCallback(async (taskData: TaskToInsert) => {
    const createdTask = await tasksService.create(taskData);

    setTasks((prev) => [...prev, createdTask]);

    return createdTask;
  }, []);

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<TaskToInsert>) => {
      const updatedTask = await tasksService.update(taskId, updates);

      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );

      return updatedTask;
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string) => {
    await tasksService.delete(taskId);

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const createChecklistItems = useCallback(
    async (taskId: string, descriptions: string[]) => {
      const createdItems = await tasksService.createChecklistItem(taskId, descriptions);

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          return {
            ...task,
            checklistItems: mergeChecklistItems(task.checklistItems, createdItems),
          };
        })
      );

      return createdItems;
    },
    []
  );

  const toggleChecklistItem = useCallback(
    async (taskId: string, itemId: string, completed: boolean) => {
      const updatedItem = await tasksService.updateChecklistItem(taskId, itemId, completed);

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          return {
            ...task,
            checklistItems: task.checklistItems?.map((item) =>
              item.id === itemId ? updatedItem : item
            ),
          };
        })
      );

      return updatedItem;
    },
    []
  );

  const deleteChecklistItem = useCallback(async (taskId: string, itemId: string) => {
    await tasksService.deleteChecklistItem(taskId, itemId);

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          checklistItems: task.checklistItems?.filter((item) => item.id !== itemId),
        };
      })
    );
  }, []);

  const value = useMemo<TasksContextType>(
    () => ({
      tasks,
      isLoadingTasks,
      tasksError,
      refreshTasks,
      createTask,
      updateTask,
      deleteTask,
      createChecklistItems,
      toggleChecklistItem,
      deleteChecklistItem,
    }),
    [
      tasks,
      isLoadingTasks,
      tasksError,
      refreshTasks,
      createTask,
      updateTask,
      deleteTask,
      createChecklistItems,
      toggleChecklistItem,
      deleteChecklistItem,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }

  return context;
}
