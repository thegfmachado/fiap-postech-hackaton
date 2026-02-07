import { Status } from "../enums/status.enum.js";
import { IChecklistItem } from "./checklist-item.interface.js";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string;
  pomodoroCount: number;
  checklist: IChecklistItem[];
  createdAt: string;
  updatedAt?: string;
}