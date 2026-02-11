import { GetAllTasksResponse } from "@mindease/database/queries";

export interface ITaskService {
  get(params?: Record<string, string | number>): Promise<GetAllTasksResponse>;
}
