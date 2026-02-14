import { Task } from '@mindease/models';
import { ITask, ITaskInsert, ITaskUpdate } from '../../types.js';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export type GetAllTasksParams = {
  userId?: string;
};

export interface ITasksQueries {
  get: (params?: GetAllTasksParams) => Promise<GetAllTasksResponse>;
  getById: (id: string) => Promise<Task>;
  create: (data: Omit<ITaskInsert, 'created_at' | 'updated_at'>) => Promise<Task>;
  update: (id: string, data: ITaskUpdate) => Promise<Task>;
  delete: (id: string) => Promise<Task>;
}
