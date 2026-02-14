import { Priority, Status, Task } from "@mindease/models";
import { ITask, ITaskInsert, ITaskUpdate, TypedSupabaseClient } from "../../types.js";
import { Tables } from "../../generated-types.js";
import { GetAllTasksParams, ITasksQueries } from "./tasks-queries.interface.js";

export class TasksQueriesService implements ITasksQueries {
  static TABLE_NAME = 'tasks' as const

  private client: TypedSupabaseClient

  constructor(client: TypedSupabaseClient) {
    this.client = client
  }

  async get(params?: GetAllTasksParams): Promise<{ data: Task[]; count: number }> {

    let query = this.client
      .from(TasksQueriesService.TABLE_NAME)
      .select('*', { count: 'exact' })
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
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async create(taskToInsert: ITaskInsert): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .insert(taskToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error creating task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async update(id: string, taskToUpdate: ITaskUpdate): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .update(taskToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  async delete(id: string): Promise<Task> {
    const { data, error } = await this.client
      .from(TasksQueriesService.TABLE_NAME)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error deleting task: ${error.message}`);
    }

    return this.dbTaskToTask(data);
  }

  private dbTaskToTask(row: Tables<'tasks'>): Task {
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
    }
  }
}
