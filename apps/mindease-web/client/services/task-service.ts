import { GetAllTasksResponse } from "@mindease/database/queries";
import { HTTPService } from "@mindease/services";
import { ITaskService } from "./transaction-service.interface";

export class TransactionService implements ITaskService {
  constructor(
    private readonly httpService: HTTPService
  ) { }

  async getAll(params?: Record<string, unknown>): Promise<GetAllTasksResponse> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get(`/api/tasks${queryString}`);
  }
}
