import { Task } from '@mindease/models';

export type GetAllTasksResponse = {
  data: Task[];
  count: number | null;
};

export interface ITasksQueries {
  getAll: (userId?: string) => Promise<GetAllTasksResponse>;
}
