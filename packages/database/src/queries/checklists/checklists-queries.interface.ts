import { ChecklistItem } from '@mindease/models';

export interface IChecklistsQueries {
  getByTaskId: (taskId: string) => Promise<ChecklistItem[]>;
  create: (taskId: string, description: string) => Promise<ChecklistItem>;
  update: (id: string, completed: boolean) => Promise<ChecklistItem>;
  delete: (id: string) => Promise<ChecklistItem>;
}
