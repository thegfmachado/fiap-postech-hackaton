"use client";

import { X, Timer } from "lucide-react";
import { Task } from "@mindease/models";
import { Button, Card, CardContent } from "@mindease/design-system/components";

function getChecklistProgress(task: Task) {
  const items = task.checklistItems ?? [];
  return {
    completed: items.filter((i) => i.completed).length,
    total: items.length,
  };
}

interface PomodoroTaskCardProps {
  task: Task;
  sessionsCompleted: number;
  targetPomodoros: number;
  isTaskComplete: boolean;
  isRunning: boolean;
  onDetach: () => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function PomodoroTaskCard({
  task,
  sessionsCompleted,
  targetPomodoros,
  isTaskComplete,
  isRunning,
  onDetach,
}: PomodoroTaskCardProps) {
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  const checklistProgress = hasChecklist ? getChecklistProgress(task) : null;
  const pomodoroProgress =
    targetPomodoros > 0
      ? Math.min(100, (sessionsCompleted / targetPomodoros) * 100)
      : 0;

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-2 min-w-0">
            <p className="text-sm font-bold truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <div
                className={`w-2 h-2 rounded-full ${
                  priorityColors[task.priority] ?? "bg-gray-400"
                }`}
              />
              <div className="flex items-center gap-1">
                <Timer className="h-3.5 w-3.5 text-primary" />
                <span>
                  {sessionsCompleted}/{targetPomodoros} pomodoros
                </span>
              </div>
              {hasChecklist && (
                <span>
                  ✓ {checklistProgress!.completed}/{checklistProgress!.total}
                </span>
              )}
              {isTaskComplete && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold text-xs">
                  ✓ Concluída
                </span>
              )}
            </div>
          </div>
          {!isRunning && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDetach}
              className="h-8 w-8 shrink-0"
              aria-label="Desvincular tarefa"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${pomodoroProgress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
