import { ChecklistItem } from '@mindease/models';
import { IChecklists, TypedSupabaseClient } from '../../types.js';
import { IChecklistsQueries } from './checklists-queries.interface.js';

export class ChecklistsQueriesService implements IChecklistsQueries {
  static TABLE_NAME = 'checklists' as const;

  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient) {
    this.client = client;
  }

  async getByTaskId(taskId: string): Promise<ChecklistItem[]> {
    const { data, error } = await this.client
      .from(ChecklistsQueriesService.TABLE_NAME)
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching checklists: ${error.message}`);
    }

    return (data ?? []).map(this.dbChecklistToChecklistItem);
  }

  async create(taskId: string, descriptions: string[]): Promise<ChecklistItem[]> {
    const { data, error } = await this.client
      .from(ChecklistsQueriesService.TABLE_NAME)
      .insert(descriptions.map(description => ({ task_id: taskId, description })))
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error creating checklist item: ${error.message}`);
    }

    return (data ?? []).map(this.dbChecklistToChecklistItem);
  }

  async update(id: string, completed: boolean): Promise<ChecklistItem> {
    const { data, error } = await this.client
      .from(ChecklistsQueriesService.TABLE_NAME)
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating checklist item: ${error.message}`);
    }

    return this.dbChecklistToChecklistItem(data);
  }

  async delete(id: string): Promise<ChecklistItem> {
    const { data, error } = await this.client
      .from(ChecklistsQueriesService.TABLE_NAME)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error deleting checklist item: ${error.message}`);
    }

    return this.dbChecklistToChecklistItem(data);
  }

  dbChecklistToChecklistItem(row: IChecklists): ChecklistItem {
    return {
      id: row.id,
      description: row.description,
      completed: row.completed,
    };
  }
}
