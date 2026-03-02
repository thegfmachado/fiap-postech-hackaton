import { Task } from '@mindease/models';
import { ITaskInsert, ITaskUpdate } from '../../types.js';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export type GetAllTasksParams = Record<string, unknown>;

export interface ITasksQueries {
  get: (params?: GetAllTasksParams) => Promise<GetAllTasksResponse>;
  getById: (id: string) => Promise<Task>;
  create: (data: ITaskInsert) => Promise<Task>;
  update: (id: string, data: ITaskUpdate) => Promise<Task>;
  delete: (id: string) => Promise<Task>;
}
