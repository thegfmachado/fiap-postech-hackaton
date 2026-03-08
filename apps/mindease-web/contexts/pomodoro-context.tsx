"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";

import { Task, Status } from "@mindease/models";
import { HTTPService } from "@mindease/services";
import { TasksService } from "@/client/services/task-service";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserSettings } from "@/hooks/use-user-settings";
import {
  usePomodoroTimer,
  type UsePomodoroTimerReturn,
} from "@/hooks/use-pomodoro-timer/use-pomodoro-timer";

const httpService = new HTTPService();
const tasksService = new TasksService(httpService);

export interface PomodoroContextType extends UsePomodoroTimerReturn {
  selectedTask: Task | null;
  availableTasks: Task[];
  isLoadingTasks: boolean;
  handleSelectTask: (task: Task) => void;
  handleStartFree: () => void;
  handleDetachTask: () => boolean;
  handleStop: () => void;
  refreshTasks: () => Promise<void>;
  toggleChecklistItem: (taskId: string, itemId: string, completed: boolean) => Promise<void>;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
  const { userSettings } = useUserSettings(user?.id);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const selectedTaskRef = useRef(selectedTask);

  useEffect(() => {
    selectedTaskRef.current = selectedTask;
  }, [selectedTask]);

  // --- Fetch tasks ---
  const refreshTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    try {
      const response = await tasksService.get();
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks for pomodoro:", err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  // --- Keep selectedTask synced with fresh task data ---
  useEffect(() => {
    if (!selectedTask) return;
    const fresh = tasks.find((t) => t.id === selectedTask.id);
    if (!fresh) {
      setSelectedTask(null);
      return;
    }
    // Compare checksums instead of references to avoid infinite updates
    const hasChecklistChange = JSON.stringify(fresh.checklistItems) !== JSON.stringify(selectedTask.checklistItems);
    if (
      fresh.completedPomodoros !== selectedTask.completedPomodoros ||
      fresh.estimatedPomodoros !== selectedTask.estimatedPomodoros ||
      fresh.status !== selectedTask.status ||
      fresh.title !== selectedTask.title ||
      hasChecklistChange
    ) {
      setSelectedTask(fresh);
    }
  }, [tasks, selectedTask]);

  // --- Callbacks for pomodoro completion ---
  const handlePomodoroComplete = useCallback(
    async (newSessionsCompleted: number) => {
      const task = selectedTaskRef.current;
      if (!task) return;
      try {
        await tasksService.update(task.id, {
          completed_pomodoros: newSessionsCompleted,
          status: task.status === Status.todo ? Status.doing : task.status,
        });
        setSelectedTask((prev) =>
          prev
            ? {
                ...prev,
                completedPomodoros: newSessionsCompleted,
                status: prev.status === Status.todo ? Status.doing : prev.status,
              }
            : null
        );
      } catch (err) {
        console.error("Error updating task pomodoro:", err);
        // Continue; timer should not break on update failure
      }
    },
    []
  );

  const handleAllPomodorosComplete = useCallback(async () => {
    const task = selectedTaskRef.current;
    if (!task) return;
    try {
      await tasksService.update(task.id, {
        completed_pomodoros: task.estimatedPomodoros,
        status: Status.done,
      });

      const incompleteItems =
        task.checklistItems?.filter((i) => !i.completed) ?? [];
      for (const item of incompleteItems) {
        await tasksService.updateChecklistItem(task.id, item.id, true);
      }

      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              completedPomodoros: prev.estimatedPomodoros,
              status: Status.done,
              checklistItems: prev.checklistItems?.map((i) => ({
                ...i,
                completed: true,
              })),
            }
          : null
      );
    } catch (err) {
      console.error("Error completing task:", err);
    }
  }, []);

  // --- Timer hook ---
  const timer = usePomodoroTimer(userSettings, {
    onPomodoroComplete: handlePomodoroComplete,
    onAllPomodorosComplete: handleAllPomodorosComplete,
  });

  // --- Available tasks ---
  const availableTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.status !== Status.done &&
          t.completedPomodoros < t.estimatedPomodoros
      ),
    [tasks]
  );

  // --- Handlers ---
  const handleSelectTask = useCallback(
    (task: Task) => {
      setSelectedTask(task);
      timer.startTaskSession(task.estimatedPomodoros, task.completedPomodoros);
    },
    [timer]
  );

  const handleStartFree = useCallback(() => {
    setSelectedTask(null);
    timer.startFreeSession();
  }, [timer]);

  const handleDetachTask = useCallback((): boolean => {
    if (timer.isRunning) {
      return false; // Caller should show "timer active" warning
    }
    setSelectedTask(null);
    timer.startFreeSession();
    return true;
  }, [timer]);

  const handleStop = useCallback(() => {
    timer.stopSession();
    // Don't clear selectedTask so the user can restart
  }, [timer]);

  const toggleChecklistItem = useCallback(
    async (taskId: string, itemId: string, completed: boolean) => {
      try {
        await tasksService.updateChecklistItem(taskId, itemId, completed);
        setSelectedTask((prev) => {
          if (!prev || prev.id !== taskId) return prev;
          return {
            ...prev,
            checklistItems: prev.checklistItems?.map((i) =>
              i.id === itemId ? { ...i, completed } : i
            ),
          };
        });
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              checklistItems: t.checklistItems?.map((i) =>
                i.id === itemId ? { ...i, completed } : i
              ),
            };
          })
        );
      } catch (err) {
        console.error("Error toggling checklist item:", err);
        throw err; // Propagate error to parent so it can handle/show to user
      }
    },
    []
  );

  const value = useMemo<PomodoroContextType>(
    () => ({
      ...timer,
      selectedTask,
      availableTasks,
      isLoadingTasks,
      handleSelectTask,
      handleStartFree,
      handleDetachTask,
      handleStop,
      refreshTasks,
      toggleChecklistItem,
    }),
    [
      timer,
      selectedTask,
      availableTasks,
      isLoadingTasks,
      handleSelectTask,
      handleStartFree,
      handleDetachTask,
      handleStop,
      refreshTasks,
      toggleChecklistItem,
    ]
  );

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro(): PomodoroContextType {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return ctx;
}
