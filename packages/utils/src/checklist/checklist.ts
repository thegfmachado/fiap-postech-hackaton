import type { ChecklistItem, Task } from "@mindease/models";

export interface ChecklistProgress {
  completed: number;
  total: number;
}

/**
 * Gets the checklist progress for a task.
 * 
 * @param task The task to get the checklist progress for. If the task has no checklist items, the progress will be 0/0.
 * @returns The checklist progress, including the number of completed items and the total number of items. If there are no checklist items, both values will be 0.
 */
export function getChecklistProgress(task: Task): ChecklistProgress {
  const items = task.checklistItems ?? [];
  return {
    completed: items.filter((i) => i.completed).length,
    total: items.length,
  };
}

/**
 * Gets the next incomplete checklist item for a task.
 * 
 * @param task The task to get the next incomplete checklist item from.
 * @returns The next incomplete checklist item, or undefined if all items are completed or if there are no checklist items.
 */
export function getNextIncompleteItem(task: Task): ChecklistItem | undefined {
  return task.checklistItems?.find((i) => !i.completed);
}
