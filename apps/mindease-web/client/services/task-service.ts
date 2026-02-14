import { GetAllTasksResponse } from "@mindease/database/queries";
import { HTTPService } from "@mindease/services";
import { ITaskService } from "./task-service.interface";
import { Task, TaskToInsert } from "@mindease/models";
import { toast } from "@mindease/design-system/components";
import { ITaskUpdate } from "@mindease/database/types";

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

  async update(id: string, updates: ITaskUpdate): Promise<Task> {
    try {
      const data = await this.httpService.patch<Task>(`/api/tasks/${id}`, updates);
      toast.success("Tarefa atualizada com sucesso")

      return data;
    }
    catch (err) {
      toast.error("Erro ao editar tarefa")
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpService.delete(`/api/tasks/${id}`);
      toast.success("tarefa deletada com sucesso")
    }
    catch (err) {
      toast.error("Erro ao deletar tarefa")
      throw err;
    }
  }
}
