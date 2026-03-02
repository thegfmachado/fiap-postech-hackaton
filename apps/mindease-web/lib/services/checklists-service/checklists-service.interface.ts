import { ChecklistItem } from "@mindease/models";

export interface IChecklistsService {
  getByTaskId: (taskId: string) => Promise<ChecklistItem[]>;
  create: (taskId: string, descriptions: string[]) => Promise<ChecklistItem[]>;
  update: (id: string, completed: boolean) => Promise<ChecklistItem>;
  delete: (id: string) => Promise<void>;
}
