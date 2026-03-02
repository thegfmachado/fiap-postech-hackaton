import { GetAllTasksResponse } from "@mindease/database/queries";
import { HTTPService } from "@mindease/services";
import { ITaskService } from "./task-service.interface";
import { Task, TaskToInsert, ChecklistItem } from "@mindease/models";
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

  async getChecklistItems(taskId: string): Promise<ChecklistItem[]> {
    try {
      return await this.httpService.get<ChecklistItem[]>(`/api/tasks/${taskId}/checklists`);
    } catch (err) {
      toast.error("Erro ao buscar itens do checklist");
      throw err;
    }
  }

  async createChecklistItem(taskId: string, descriptions: string[]): Promise<ChecklistItem[]> {
    try {
      const data = await this.httpService.post<ChecklistItem[]>(
        `/api/tasks/${taskId}/checklists`,
        { descriptions }
      );

      return data;
    } catch (err) {
      toast.error("Erro ao adicionar itens à checklist");
      throw err;
    }
  }

  async updateChecklistItem(taskId: string, itemId: string, completed: boolean): Promise<ChecklistItem> {
    try {
      const data = await this.httpService.patch<ChecklistItem>(
        `/api/tasks/${taskId}/checklists/${itemId}`,
        { completed }
      );
      return data;
    } catch (err) {
      toast.error("Erro ao atualizar item do checklist");
      throw err;
    }
  }

  async deleteChecklistItem(taskId: string, itemId: string): Promise<void> {
    try {
      await this.httpService.delete(`/api/tasks/${taskId}/checklists/${itemId}`);
    } catch (err) {
      toast.error("Erro ao remover item do checklist");
      throw err;
    }
  }
}
