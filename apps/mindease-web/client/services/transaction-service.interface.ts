import { GetAllTasksResponse } from "@mindease/database/queries";

export interface ITaskService {
  getAll(params?: Record<string, string | number>): Promise<GetAllTasksResponse>;
}
