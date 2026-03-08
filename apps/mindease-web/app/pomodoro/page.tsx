"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain, Square, PlusCircle } from "lucide-react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mindease/design-system/components";

import { usePomodoro } from "@/contexts/pomodoro-context";
import { ModeSelector } from "@/components/pomodoro/mode-selector";
import { TaskPickerDialog } from "@/components/pomodoro/task-picker-dialog";
import { PomodoroTaskCard } from "@/components/pomodoro/pomodoro-task-card";
import { PomodoroTaskChecklist } from "@/components/pomodoro/pomodoro-task-checklist";
import { ConfirmDialog } from "@/components/pomodoro/confirm-dialog";

const modeConfig = {
  work: {
    label: "Foco",
    icon: Brain,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  break: {
    label: "Pausa Curta",
    icon: Coffee,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  longBreak: {
    label: "Pausa Longa",
    icon: Coffee,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
};

export default function PomodoroPage() {
  const {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    progress,
    toggleTimer,
    resetTimer,
    changeMode,
    formatTime,
    pomodoroMode,
    targetPomodoros,
    isTaskComplete,
    selectedTask,
    availableTasks,
    handleSelectTask,
    handleStartFree,
    handleDetachTask,
    handleStop,
    settings,
    toggleChecklistItem,
  } = usePomodoro();

  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showTimerActiveInfo, setShowTimerActiveInfo] = useState(false);
  const [showTaskCompleteInfo, setShowTaskCompleteInfo] = useState(false);
  const [taskCompleteMsg] = useState("");

  const currentConfig = modeConfig[mode];
  const Icon = currentConfig.icon;

  const canStart = pomodoroMode !== "task" || !!selectedTask;

  const onSelectTask = (task: Parameters<typeof handleSelectTask>[0]) => {
    handleSelectTask(task);
    setShowTaskPicker(false);
  };

  const onStartFree = () => {
    handleStartFree();
    setShowTaskPicker(false);
  };

  const onDetachTask = () => {
    const success = handleDetachTask();
    if (!success) {
      setShowTimerActiveInfo(true);
    }
  };

  const onStop = () => {
    setShowStopConfirm(true);
  };

  // Determine session indicator count
  const indicatorCount =
    pomodoroMode === "task" && targetPomodoros > 0
      ? targetPomodoros
      : settings.longBreakAfterPomodoros;

  const indicatorFilled =
    pomodoroMode === "task" && targetPomodoros > 0
      ? sessionsCompleted
      : sessionsCompleted % settings.longBreakAfterPomodoros;

  return (
    <Layout>
      <Header />
      <Sidebar />
      <Main>
        <div className="flex flex-col w-full p-4 md:p-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold">Timer Pomodoro</h1>
            <p className="text-muted-foreground mt-1">
              {pomodoroMode === "task"
                ? "Modo vinculado à tarefa"
                : "Modo livre — ciclos infinitos"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Mode Selector */}
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

            {/* Task Card or Placeholder */}
            {pomodoroMode === "task" && selectedTask && (
              <PomodoroTaskCard
                task={selectedTask}
                sessionsCompleted={sessionsCompleted}
                targetPomodoros={targetPomodoros}
                isTaskComplete={isTaskComplete}
                isRunning={isRunning}
                onDetach={onDetachTask}
              />
            )}

            {pomodoroMode === "task" && !selectedTask && (
              <button
                onClick={() => setShowTaskPicker(true)}
                className="w-full max-w-2xl p-4 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <PlusCircle className="h-7 w-7" />
                <span className="text-sm font-medium">
                  Selecione uma tarefa
                </span>
              </button>
            )}

            {/* Timer Mode Buttons */}
            <div className="flex gap-2">
              {(["work", "break", "longBreak"] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  onClick={() => changeMode(m)}
                  disabled={isRunning}
                >
                  {modeConfig[m].label}
                </Button>
              ))}
            </div>

            {/* Timer Circle */}
            <Card className={`w-full max-w-2xl ${currentConfig.bgColor} border-2`}>
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center gap-6">
                  <div className={`${currentConfig.color} flex items-center gap-2`}>
                    <Icon className="h-8 w-8" />
                    <span className="text-lg font-semibold">
                      {currentConfig.label}
                    </span>
                  </div>

                  <div className="relative w-full max-w-md aspect-square">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted opacity-20"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={currentConfig.color}
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-6xl md:text-8xl font-bold ${currentConfig.color}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="min-w-32"
                      disabled={!canStart || isTaskComplete}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetTimer}>
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    {sessionsCompleted > 0 && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={onStop}
                        className="text-destructive hover:text-destructive"
                      >
                        <Square className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Indicator */}
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-center">Sessões Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: indicatorCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold ${
                        i < indicatorFilled
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Total: {sessionsCompleted} pomodoros completados
                  {pomodoroMode === "task" && targetPomodoros > 0
                    ? ` de ${targetPomodoros}`
                    : ""}
                </p>
              </CardContent>
            </Card>

            {/* Checklist during running task session */}
            {pomodoroMode === "task" && selectedTask && isRunning && (
              <PomodoroTaskChecklist
                task={selectedTask}
                onToggleItem={toggleChecklistItem}
              />
            )}
          </div>
        </div>
      </Main>

      {/* Task Picker Dialog */}
      <TaskPickerDialog
        open={showTaskPicker}
        tasks={availableTasks}
        onSelectTask={onSelectTask}
        onStartFree={onStartFree}
        onClose={() => setShowTaskPicker(false)}
      />

      {/* Stop Confirmation */}
      <ConfirmDialog
        open={showStopConfirm}
        title="Parar sessão"
        message="Deseja parar a sessão atual? O progresso do pomodoro atual será perdido."
        confirmLabel="Parar"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          setShowStopConfirm(false);
          handleStop();
        }}
        onCancel={() => setShowStopConfirm(false)}
      />

      {/* Timer Active Info */}
      <ConfirmDialog
        open={showTimerActiveInfo}
        title="Timer ativo"
        message="Pare o timer antes de trocar o modo."
        confirmLabel="OK"
        infoOnly
        onConfirm={() => setShowTimerActiveInfo(false)}
        onCancel={() => setShowTimerActiveInfo(false)}
      />

      {/* Task Complete Info */}
      <ConfirmDialog
        open={showTaskCompleteInfo}
        title="🎉 Tarefa Concluída!"
        message={taskCompleteMsg}
        confirmLabel="OK"
        infoOnly
        onConfirm={() => setShowTaskCompleteInfo(false)}
        onCancel={() => setShowTaskCompleteInfo(false)}
      />
    </Layout>
  );
}