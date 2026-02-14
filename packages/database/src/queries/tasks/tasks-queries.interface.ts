import { Task } from '@mindease/models';
import { ITask, ITaskInsert } from '../../types.js';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export type GetAllTasksParams = {
  userId?: string;
};

export interface ITasksQueries {
  get: (params?: GetAllTasksParams) => Promise<GetAllTasksResponse>;
  create: (data: Omit<ITaskInsert, 'created_at' | 'updated_at'>) => Promise<Task>;
}
