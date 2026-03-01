import { Priority } from "../enums/priority.enum.js";
import { Status } from "../enums/status.enum.js";
import { ChecklistItem } from "./checklist-item.interface.js";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt?: string;
  updatedAt?: string;
  priority: Priority;
  checklistItems?: ChecklistItem[];
}

export interface TaskToInsert {
  id?: string;
  title: string;
  description?: string;
  status?: Status;
  dueDate?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  priority?: Priority;
  checklistItems?: Omit<ChecklistItem, "id">[];
}