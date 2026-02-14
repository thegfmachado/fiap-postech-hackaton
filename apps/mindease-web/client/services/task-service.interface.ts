import { GetAllTasksResponse } from "@mindease/database/queries";
import { Task, TaskToInsert } from "@mindease/models";

export interface ITaskService {
  get(params?: Record<string, string | number>): Promise<GetAllTasksResponse>;
  create(task: TaskToInsert): Promise<Task>;
  update(id: string, updates: TaskToInsert): Promise<Task>;
  delete(id: string): Promise<void>;
}
