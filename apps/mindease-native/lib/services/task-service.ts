import { supabase } from "@/lib/supabase";
import { Task, TaskToInsert, ChecklistItem, Priority, Status } from "@mindease/models";
import type { TaskRowWithChecklists } from "@mindease/database/types";

function mapRowToTask(row: TaskRowWithChecklists): Task {
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
    checklistItems: row.checklists?.map(checklist => ({
      id: checklist.id,
      description: checklist.description,
      completed: checklist.completed,
    }))
  };
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, checklists(id, description, completed, task_id)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(mapRowToTask);
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

    if (task.checklistItems && task.checklistItems.length > 0 && data) {
      const checklistInserts = task.checklistItems.map(item => ({
        description: item.description,
        completed: item.completed,
        task_id: data.id,
      }));

      const checklistResult = await supabase.from("checklists").insert(checklistInserts).select();
      
      if (checklistResult.error) {
        throw checklistResult.error;
      }

      // @ts-expect-error - Interface is defined by select query, since we are creating it now, it does not have checklist items
      data.checklists = checklistResult.data || [];
    }

    if (error) throw error;
    return mapRowToTask(data);
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
      .select("*, checklists(id, description, completed, task_id)")
      .single();

    if (error) throw error;
    return mapRowToTask(data);
  },

  async toggleChecklistItem(itemId: string, completed: boolean): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from("checklists")
      .update({ completed })
      .eq("id", itemId)
      .select("id, description, completed")
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  async addChecklistItem(taskId: string, description: string): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from("checklists")
      .insert({ task_id: taskId, description, completed: false })
      .select("id, description, completed")
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  async removeChecklistItem(itemId: string): Promise<void> {
    const { error } = await supabase
      .from("checklists")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  },

  async updateChecklistItemDescription(itemId: string, description: string): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from("checklists")
      .update({ description })
      .eq("id", itemId)
      .select("id, description, completed")
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  async updateChecklistItem(itemId: string, updates: { description?: string; completed?: boolean }): Promise<ChecklistItem> {
    const { data, error } = await supabase
      .from("checklists")
      .update(updates)
      .eq("id", itemId)
      .select("id, description, completed")
      .single();

    if (error) throw error;
    return data as ChecklistItem;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },
};
