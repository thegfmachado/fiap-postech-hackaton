import { supabase } from "@/lib/supabase";
import { Task, TaskToInsert, Priority, Status } from "@mindease/models";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  estimated_pomodoros: number;
  completed_pomodoros: number;
  created_at: string | null;
  updated_at: string | null;
};

function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as Status,
    priority: row.priority as Priority,
    dueDate: row.due_date ?? undefined,
    estimatedPomodoros: row.estimated_pomodoros,
    completedPomodoros: row.completed_pomodoros,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as TaskRow[]).map(mapRowToTask);
  },

  async create(task: TaskToInsert): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        description: task.description || "",
        status: task.status || Status.todo,
        priority: task.priority || Priority.medium,
        due_date: task.dueDate || null,
        estimated_pomodoros: task.estimatedPomodoros || 1,
        completed_pomodoros: task.completedPomodoros || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return mapRowToTask(data as TaskRow);
  },

  async update(id: string, updates: Partial<TaskToInsert>): Promise<Task> {
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.estimatedPomodoros !== undefined) updateData.estimated_pomodoros = updates.estimatedPomodoros;
    if (updates.completedPomodoros !== undefined) updateData.completed_pomodoros = updates.completedPomodoros;

    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToTask(data as TaskRow);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};
