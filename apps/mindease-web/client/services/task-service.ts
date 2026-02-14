import { GetAllTasksResponse } from "@mindease/database/queries";
import { HTTPService } from "@mindease/services";
import { ITaskService } from "./task-service.interface";
import { Task, TaskToInsert } from "@mindease/models";
import { toast } from "@mindease/design-system/components";

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

  async create(tasks: TaskToInsert): Promise<Task> {
    try {
      const data = await this.httpService.post<Task>("/api/tasks", tasks);
      toast.success("Tarefa criada com sucesso")

      return data;
    }
    catch (err) {
      toast.error("Erro ao criar Tarefa")
      throw err;
    }
  }
}
