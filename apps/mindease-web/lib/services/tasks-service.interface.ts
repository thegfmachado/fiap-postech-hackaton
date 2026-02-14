import { GetAllTasksResponse } from "@mindease/database/queries";
import { Task, TaskToInsert } from "@mindease/models";

export interface ITaskService {
  get(params?: Record<string, unknown>): Promise<GetAllTasksResponse>;
  create: (task: TaskToInsert) => Promise<Task>;
}
