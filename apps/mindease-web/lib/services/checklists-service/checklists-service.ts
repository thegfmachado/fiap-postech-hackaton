import { IChecklistsQueries } from "@mindease/database/queries";
import { HttpError } from "@mindease/services";
import { IChecklistsService } from "./checklists-service.interface";
import { ChecklistItem } from "@mindease/models";

export class ChecklistsService implements IChecklistsService {
  private readonly queries: IChecklistsQueries;

  constructor(queries: IChecklistsQueries) {
    this.queries = queries;
  }

  async getByTaskId(taskId: string): Promise<ChecklistItem[]> {
    try {
      return await this.queries.getByTaskId(taskId);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      throw new HttpError(500, 'Error fetching checklists');
    }
  }

  async create(taskId: string, description: string): Promise<ChecklistItem> {
    try {
      return await this.queries.create(taskId, description);
    } catch (error) {
      console.error('Error creating checklist item:', error);
      throw new HttpError(500, 'Error creating checklist item');
    }
  }

  async update(id: string, completed: boolean): Promise<ChecklistItem> {
    try {
      return await this.queries.update(id, completed);
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw new HttpError(500, 'Error updating checklist item');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.queries.delete(id);
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      throw new HttpError(500, 'Error deleting checklist item');
    }
  }
}
