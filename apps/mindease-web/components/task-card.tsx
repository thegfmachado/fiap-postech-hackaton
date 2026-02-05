"use client";

import { GripVertical, Trash2, Edit, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, Button } from "@mindease/design-system/components";
import { useDisplayMode } from "@/hooks/use-display-mode";
import type { Task } from "@/components/task-form";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  draggable?: boolean;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export function TaskCard({ task, onDelete, onEdit, onView, onDragStart, draggable = false }: TaskCardProps) {
  const { isSimplified } = useDisplayMode();

  return (
    <Card
      className="cursor-move hover:shadow-md transition-shadow"
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onClick={() => onView?.(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            {!isSimplified && <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5" />}
            <h3 className="font-semibold text-sm leading-tight">{task.title}</h3>
          </div>
          {!isSimplified && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Editar tarefa</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Deletar tarefa</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isSimplified && task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </span>
          
          {!isSimplified && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
