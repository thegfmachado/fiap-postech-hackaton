import { Task } from '@mindease/models';
import { TaskRowInsert, TaskRowUpdate } from '../../types.js';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export type GetAllTasksParams = Record<string, unknown>;

export interface ITasksQueries {
  get: (params?: GetAllTasksParams) => Promise<GetAllTasksResponse>;
  getById: (id: string) => Promise<Task>;
  create: (data: TaskRowInsert) => Promise<Task>;
  update: (id: string, data: TaskRowUpdate) => Promise<Task>;
  delete: (id: string) => Promise<void>;
}
