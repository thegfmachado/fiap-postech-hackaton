"use client";

import { CheckSquare, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@mindease/design-system/components";
import type { PomodoroMode } from "@/hooks/use-pomodoro-timer/use-pomodoro-timer";

interface ModeSelectorProps {
  pomodoroMode: PomodoroMode;
  isRunning: boolean;
  onSelectTask: () => void;
  onSelectFree: () => void;
}

export function ModeSelector({
  pomodoroMode,
  isRunning,
  onSelectTask,
  onSelectFree,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      <Button
        variant={pomodoroMode === "task" ? "default" : "ghost"}
        size="sm"
        onClick={onSelectTask}
        disabled={isRunning}
        className="gap-1.5"
      >
        <CheckSquare className="h-4 w-4" />
        Com Tarefa
      </Button>
      <Button
        variant={pomodoroMode === "free" ? "default" : "ghost"}
        size="sm"
        onClick={onSelectFree}
        disabled={isRunning}
        className="gap-1.5"
      >
        <InfinityIcon className="h-4 w-4" />
        Livre
      </Button>
    </div>
  );
}
