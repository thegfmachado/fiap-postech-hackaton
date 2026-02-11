import { GetAllTasksResponse } from "@mindease/database/queries";
import { HTTPService } from "@mindease/services";
import { ITaskService } from "./task-service.interface";

export class TasksService implements ITaskService {
  constructor(
    private readonly httpService: HTTPService
  ) { }

  async get(params?: Record<string, unknown>): Promise<GetAllTasksResponse> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get(`/api/tasks${queryString}`);
  }
}
