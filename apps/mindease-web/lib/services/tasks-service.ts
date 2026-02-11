import { ITasksQueries } from "@mindease/database/queries";
import { HttpError } from "@mindease/services";
import { ITaskService } from "./tasks-service.interface";

export class TaskService implements ITaskService {
  private readonly queries: ITasksQueries

  constructor(queries: ITasksQueries) {
    this.queries = queries;
  }

  async get(params?: Record<string, string>) {
    try {
      const tasks = await this.queries.get(params);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new HttpError(500, 'Error fetching tasks');
    }
  }
}
