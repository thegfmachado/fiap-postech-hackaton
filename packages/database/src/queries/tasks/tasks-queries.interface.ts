import { Task } from '@mindease/models';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export type GetAllTasksParams = {
  userId?: string;
};

export interface ITasksQueries {
  get: (params?: GetAllTasksParams) => Promise<GetAllTasksResponse>;
}
