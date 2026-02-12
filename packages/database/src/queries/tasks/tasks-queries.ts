import { Priority, Status, Task } from "@mindease/models";
import { TypedSupabaseClient } from "../../types.js";
import { Tables } from "../../generated-types.js";
import { GetAllTasksParams, ITasksQueries } from "./tasks-queries.interface.js";

export class TasksQueriesService implements ITasksQueries {
  static TABLE_NAME = 'tasks' as const

  private client: TypedSupabaseClient

  constructor(client: TypedSupabaseClient) {
    this.client = client
  }

  async get(params?: GetAllTasksParams): Promise<{ data: Task[]; count: number }> {
    const { userId } = params || {};

    let query = this.client
      .from(TasksQueriesService.TABLE_NAME)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

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

  private dbTaskToTask(row: Tables<'tasks'>): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      status: row.status as Status,
      dueDate: row.due_date ?? undefined,
      estimatedPomodoros: row.estimated_pomodoros,
      completedPomodoros: row.completed_pomodoros,
      checklist: row.checklist as any[] | undefined,
      createdAt: row.created_at ?? undefined,
      updatedAt: row.updated_at ?? undefined,
      priority: row.priority as Priority,
    }
  }
}
