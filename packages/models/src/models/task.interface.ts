import { Priority } from "../enums/priority.enum.js";
import { Status } from "../enums/status.enum.js";

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
}

export interface TaskToInsert {
  id?: string;
  title: string;
  description?: string;
  status?: Status;
  dueDate?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  createdAt?: string;
  updatedAt?: string;
  priority?: Priority;
  userId?: string;
}