import { GetAllTasksResponse } from "@mindease/database/queries";
import { Task, TaskToInsert } from "@mindease/models";

export interface ITaskService {
  get(params?: Record<string, string | number>): Promise<GetAllTasksResponse>;
  create(transaction: TaskToInsert): Promise<Task>;
}
