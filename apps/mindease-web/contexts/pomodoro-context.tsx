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
import { useTasksContext } from "@/contexts/tasks-context";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserSettings } from "@/hooks/use-user-settings";
import {
  usePomodoroTimer,
  type UsePomodoroTimerReturn,
} from "@/hooks/use-pomodoro-timer/use-pomodoro-timer";

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
  const {
    tasks,
    isLoadingTasks,
    refreshTasks,
    updateTask,
    toggleChecklistItem: toggleTaskChecklistItem,
  } = useTasksContext();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );
  const selectedTaskRef = useRef(selectedTask);

  useEffect(() => {
    selectedTaskRef.current = selectedTask;
  }, [selectedTask]);

  useEffect(() => {
    if (selectedTaskId && !selectedTask) {
      setSelectedTaskId(null);
    }
  }, [selectedTask, selectedTaskId]);

  // --- Callbacks for pomodoro completion ---
  const handlePomodoroComplete = useCallback(
    async (newSessionsCompleted: number) => {
      const task = selectedTaskRef.current;
      if (!task) return;
      try {
        await updateTask(task.id, {
          completedPomodoros: newSessionsCompleted,
          status: task.status === Status.todo ? Status.doing : task.status,
        });
      } catch (err) {
        console.error("Error updating task pomodoro:", err);
        // Continue; timer should not break on update failure
      }
    },
    [updateTask]
  );

  const handleAllPomodorosComplete = useCallback(
    async () => {
      const task = selectedTaskRef.current;
      if (!task) return;

      try {
        await updateTask(task.id, {
          completedPomodoros: task.estimatedPomodoros,
          status: Status.done,
        });

        const incompleteItems =
          task.checklistItems?.filter((item) => !item.completed) ?? [];

        for (const item of incompleteItems) {
          await toggleTaskChecklistItem(task.id, item.id, true);
        }
      } catch (err) {
        console.error("Error completing task:", err);
      }
    },
    [toggleTaskChecklistItem, updateTask]
  );

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
      setSelectedTaskId(task.id);
      timer.startTaskSession(task.estimatedPomodoros, task.completedPomodoros);
    },
    [timer]
  );

  const handleStartFree = useCallback(() => {
    setSelectedTaskId(null);
    timer.startFreeSession();
  }, [timer]);

  const handleDetachTask = useCallback((): boolean => {
    if (timer.isRunning) {
      return false; // Caller should show "timer active" warning
    }
    setSelectedTaskId(null);
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
        await toggleTaskChecklistItem(taskId, itemId, completed);
      } catch (err) {
        console.error("Error toggling checklist item:", err);
        throw err; // Propagate error to parent so it can handle/show to user
      }
    },
    [toggleTaskChecklistItem]
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
