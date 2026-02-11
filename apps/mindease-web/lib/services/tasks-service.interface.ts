import { GetAllTasksResponse } from "@mindease/database/queries";

export interface ITaskService {
  get(params?: Record<string, unknown>): Promise<GetAllTasksResponse>;
}
