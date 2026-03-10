"use client";

import { useState } from "react";
import { Task } from "@mindease/models";
import { Card, CardContent, toast } from "@mindease/design-system/components";

function getChecklistProgress(task: Task) {
  const items = task.checklistItems ?? [];
  return {
    completed: items.filter((i) => i.completed).length,
    total: items.length,
  };
}

interface PomodoroTaskChecklistProps {
  task: Task;
  onToggleItem: (taskId: string, itemId: string, completed: boolean) => Promise<void>;
}

export function PomodoroTaskChecklist({
  task,
  onToggleItem,
}: PomodoroTaskChecklistProps) {
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

  const handleToggleItem = async (itemId: string, newCompleted: boolean) => {
    setTogglingItemId(itemId);
    try {
      await onToggleItem(task.id, itemId, newCompleted);
    } catch (err) {
      toast.error("Erro ao atualizar item do checklist");
      console.error("Checklist toggle error:", err);
    } finally {
      setTogglingItemId(null);
    }
  };

  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  if (!hasChecklist) return null;

  const checklistProgress = getChecklistProgress(task);

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Checklist
          </span>
          <span className="text-xs text-muted-foreground">
            {checklistProgress.completed}/{checklistProgress.total}
          </span>
        </div>

        <div className="space-y-2">
          {task.checklistItems!.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() =>
                  handleToggleItem(item.id, !item.completed)
                }
                disabled={togglingItemId === item.id}
                className="w-4 h-4 rounded cursor-pointer disabled:opacity-50"
              />
              <span
                className={`flex-1 text-sm ${
                  item.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {item.description}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
