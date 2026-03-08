"use client";

import { X, Timer, Inbox } from "lucide-react";
import { Task } from "@mindease/models";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@mindease/design-system/components";

interface TaskPickerDialogProps {
  open: boolean;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStartFree: () => void;
  onClose: () => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function TaskPickerDialog({
  open,
  tasks,
  onSelectTask,
  onStartFree,
  onClose,
}: TaskPickerDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <Card className="relative z-10 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Selecionar Tarefa</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2 pb-4">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">Nenhuma tarefa disponível</p>
              <p className="text-sm mt-1 text-center">
                Crie tarefas na página inicial para vinculá-las ao Pomodoro
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const progress =
                task.estimatedPomodoros > 0
                  ? (task.completedPomodoros / task.estimatedPomodoros) * 100
                  : 0;

              return (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Timer className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold">
                          {task.completedPomodoros}/{task.estimatedPomodoros}
                        </span>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          priorityColors[task.priority] ?? "bg-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-1 rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              );
            })
          )}

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={onStartFree}
            >
              Usar modo livre
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
