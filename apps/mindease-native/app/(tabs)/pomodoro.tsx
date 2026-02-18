import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  usePomodoroTimer,
  type TimerMode,
} from "@/hooks/usePomodoroTimer";
import { useTasks } from "@/contexts/tasks-context";
import { usePomodoroSettingsContext } from "@/contexts/pomodoro-settings-context";
import { Task, Status } from "@mindease/models";
import { Colors } from "@/constants/Colors";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useAppColors } from "@/hooks/useAppColors";
import { ModeSelector } from "@/components/pomodoro/ModeSelector";
import { TaskCard as PomodoroTaskCard } from "@/components/pomodoro/TaskCard";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { TimerCircle } from "@/components/pomodoro/TimerCircle";
import { Controls } from "@/components/pomodoro/Controls";
import { SessionIndicator } from "@/components/pomodoro/SessionIndicator";
import { TaskPicker } from "@/components/pomodoro/TaskPicker";

const getTimerModeConfig = (isDark: boolean): Record<
  TimerMode,
  { label: string; color: string; bgColor: string; icon: string }
> => ({
  work: {
    label: "Foco",
    color: isDark ? Colors.dark.primary : Colors.light.primary,
    bgColor: isDark ? "#142F3D" : "#D8FAF0",
    icon: "psychology",
  },
  break: {
    label: "Pausa Curta",
    color: isDark ? "#4ADE80" : "#31A43B",
    bgColor: isDark ? "#14302A" : "#E6FBDB",
    icon: "coffee",
  },
  longBreak: {
    label: "Pausa Longa",
    color: isDark ? "#818CF8" : "#5570D6",
    bgColor: isDark ? "#1E1B3A" : "#F0FDFA",
    icon: "coffee",
  },
});

export default function PomodoroScreen() {
  const { isDark } = useAppColors();
  const timerModeConfig = useMemo(() => getTimerModeConfig(isDark), [isDark]);
  const { tasks, updateTask } = useTasks();
  const { settings: contextSettings } = usePomodoroSettingsContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showTimerActiveInfo, setShowTimerActiveInfo] = useState(false);
  const [showTaskCompleteInfo, setShowTaskCompleteInfo] = useState(false);
  const [taskCompleteMsg, setTaskCompleteMsg] = useState("");
  const selectedTaskRef = useRef(selectedTask);

  React.useEffect(() => {
    selectedTaskRef.current = selectedTask;
  }, [selectedTask]);

  React.useEffect(() => {
    if (!selectedTask) return;
    const fresh = tasks.find((t) => t.id === selectedTask.id);
    if (!fresh) {
      setSelectedTask(null);
      return;
    }
    if (
      fresh.completedPomodoros !== selectedTask.completedPomodoros ||
      fresh.estimatedPomodoros !== selectedTask.estimatedPomodoros ||
      fresh.status !== selectedTask.status ||
      fresh.title !== selectedTask.title
    ) {
      setSelectedTask(fresh);
    }
  }, [tasks, selectedTask]);

  const handlePomodoroComplete = useCallback(
    async (newSessionsCompleted: number) => {
      const task = selectedTaskRef.current;
      if (!task) return;
      try {
        await updateTask(task.id, {
          completedPomodoros: newSessionsCompleted,
          status:
            task.status === Status.todo
              ? Status.doing
              : task.status,
        });
        setSelectedTask((prev) =>
          prev
            ? {
                ...prev,
                completedPomodoros: newSessionsCompleted,
                status:
                  prev.status === Status.todo ? Status.doing : prev.status,
              }
            : null
        );
      } catch (err) {
        console.error("Error updating task pomodoro:", err);
      }
    },
    [updateTask]
  );

  const handleAllPomodorosComplete = useCallback(async () => {
    const task = selectedTaskRef.current;
    if (!task) return;
    try {
      await updateTask(task.id, {
        completedPomodoros: task.estimatedPomodoros,
        status: Status.done,
      });
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              completedPomodoros: prev.estimatedPomodoros,
              status: Status.done,
            }
          : null
      );
      const msg = `Todos os pomodoros de "${task.title}" foram completados! A tarefa foi marcada como concluída.`;
      setTaskCompleteMsg(msg);
      setShowTaskCompleteInfo(true);
    } catch (err) {
      console.error("Error completing task:", err);
    }
  }, [updateTask]);

  const {
    timerMode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    settings,
    progress,
    pomodoroMode,
    targetPomodoros,
    isTaskComplete,
    toggleTimer,
    resetTimer,
    changeMode,
    formatTime,
    startTaskSession,
    startFreeSession,
    stopSession,
  } = usePomodoroTimer(contextSettings, {
    onPomodoroComplete: handlePomodoroComplete,
    onAllPomodorosComplete: handleAllPomodorosComplete,
  });

  const config = timerModeConfig[timerMode];

  const availableTasks = tasks.filter(
    (t) => t.status !== Status.done && t.completedPomodoros < t.estimatedPomodoros
  );

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    startTaskSession(task.estimatedPomodoros, task.completedPomodoros);
    setShowTaskPicker(false);
  };

  const handleStartFree = () => {
    setSelectedTask(null);
    startFreeSession();
  };

  const handleDetachTask = () => {
    if (isRunning) {
      setShowTimerActiveInfo(true);
      return;
    }
    setSelectedTask(null);
    startFreeSession();
  };

  const handleStop = () => {
    setShowStopConfirm(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="px-6 pt-2 pb-3">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Timer Pomodoro
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pomodoroMode === "task"
              ? "Modo vinculado à tarefa"
              : "Modo livre — ciclos infinitos"}
          </Text>
        </View>

        <ModeSelector
          pomodoroMode={pomodoroMode}
          isRunning={isRunning}
          onSelectTask={() => {
            if (!isRunning) setShowTaskPicker(true);
          }}
          onSelectFree={() => {
            if (!isRunning) handleStartFree();
          }}
        />

        {pomodoroMode === "task" && selectedTask && (
          <PomodoroTaskCard
            task={selectedTask}
            sessionsCompleted={sessionsCompleted}
            targetPomodoros={targetPomodoros}
            isTaskComplete={isTaskComplete}
            isRunning={isRunning}
            onDetach={handleDetachTask}
          />
        )}

        {pomodoroMode === "task" && !selectedTask && (
          <TouchableOpacity
            onPress={() => setShowTaskPicker(true)}
            className="mx-6 mb-4 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl items-center"
          >
            <MaterialIcons name="add-task" size={28} color="#9CA3AF" />
            <Text className="text-sm text-gray-400 mt-1 font-medium">
              Selecione uma tarefa
            </Text>
          </TouchableOpacity>
        )}

        <TimerModeSelector
          timerMode={timerMode}
          isRunning={isRunning}
          config={timerModeConfig}
          onChangeMode={changeMode}
        />

        <TimerCircle
          config={config}
          timeFormatted={formatTime(timeLeft)}
          progress={progress}
        >
          <Controls
            isRunning={isRunning}
            isTaskComplete={isTaskComplete}
            canStart={pomodoroMode !== "task" || !!selectedTask}
            sessionsCompleted={sessionsCompleted}
            accentColor={config.color}
            onToggle={toggleTimer}
            onReset={resetTimer}
            onStop={handleStop}
          />
        </TimerCircle>

        <SessionIndicator
          pomodoroMode={pomodoroMode}
          sessionsCompleted={sessionsCompleted}
          targetPomodoros={targetPomodoros}
          settings={settings}
        />
      </ScrollView>

      <TaskPicker
        visible={showTaskPicker}
        tasks={availableTasks}
        onSelectTask={handleSelectTask}
        onStartFree={() => {
          handleStartFree();
          setShowTaskPicker(false);
        }}
        onClose={() => setShowTaskPicker(false)}
      />

      <ConfirmModal
        visible={showStopConfirm}
        title="Parar sessão"
        message="Deseja parar a sessão atual? O progresso do pomodoro atual será perdido."
        confirmLabel="Parar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          setShowStopConfirm(false);
          stopSession();
        }}
        onCancel={() => setShowStopConfirm(false)}
      />

      <ConfirmModal
        visible={showTimerActiveInfo}
        title="Timer ativo"
        message="Pare o timer antes de trocar o modo."
        confirmLabel="OK"
        infoOnly
        onConfirm={() => setShowTimerActiveInfo(false)}
        onCancel={() => setShowTimerActiveInfo(false)}
      />

      <ConfirmModal
        visible={showTaskCompleteInfo}
        title="🎉 Tarefa Concluída!"
        message={taskCompleteMsg}
        confirmLabel="OK"
        infoOnly
        onConfirm={() => setShowTaskCompleteInfo(false)}
        onCancel={() => setShowTaskCompleteInfo(false)}
      />
    </SafeAreaView>
  );
}
