import { Priority, Status, Task } from "@mindease/models";
import { TaskRow, TaskRowInsert, TaskRowUpdate, TypedSupabaseClient } from "../../types.js";
import { GetAllTasksResponse, ITasksQueries } from "./tasks-queries.interface.js";

export class TasksQueriesService implements ITasksQueries {
  static TABLE_NAME = 'tasks' as const

  private client: TypedSupabaseClient

  constructor(client: TypedSupabaseClient) {
    this.client = client
  }

  private selectString = '*, checklists(id, description, completed)' as const;

  async get(): Promise<GetAllTasksResponse> {
    const query = this.client
      .from(TasksQueriesService.TABLE_NAME)
      .select(this.selectString, { count: 'exact' })
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Error fetching tasks: ${error.message}`)
    }

    return {
      data: (data ?? []).map(this.dbTaskToTask),
      count: count ?? 0,
    }
  }

  async getById(id: string): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .select(this.selectString)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async create(taskToInsert: TaskRowInsert): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .insert(taskToInsert)
      .select(this.selectString)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error creating task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async update(id: string, taskToUpdate: TaskRowUpdate): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .update(taskToUpdate)
      .eq('id', id)
      .select(this.selectString)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }

  dbTaskToTask(row: TaskRow): Task {
    let checklistItems = [];

    if ('checklists' in row && Array.isArray(row.checklists)) {
      checklistItems = row.checklists;
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Status,
      dueDate: row.due_date ?? undefined,
      estimatedPomodoros: row.estimated_pomodoros,
      completedPomodoros: row.completed_pomodoros,
      createdAt: row.created_at ?? undefined,
      updatedAt: row.updated_at ?? undefined,
      priority: row.priority as Priority,
      checklistItems,
    }
  }
}

