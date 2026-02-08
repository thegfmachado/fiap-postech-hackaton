import { Priority, Status, Task } from "@mindease/models";
import { TypedSupabaseClient } from "../../types.js";
import { Tables } from "../../generated-types.js";
import { ITasksQueries } from "./tasks-queries.interface.js";


export class TasksQueriesService implements ITasksQueries {
  static TABLE_NAME = 'tasks' as const

  private client: TypedSupabaseClient

  constructor(client: TypedSupabaseClient) {
    this.client = client
  }

  async getAllTasks(userId?: string): Promise<{ data: Task[]; count: number }> {
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
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority as Priority,
    }
  }
}
