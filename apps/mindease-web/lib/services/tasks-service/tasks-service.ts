import { ITasksQueries } from "@mindease/database/queries";
import { HttpError } from "@mindease/services";
import { ITaskService } from "./tasks-service.interface";
import type { TaskRowInsert, TaskRowUpdate } from '@mindease/database/types';
import { TaskToInsert } from "@mindease/models";

export class TaskService implements ITaskService {
  private readonly queries: ITasksQueries

  constructor(queries: ITasksQueries) {
    this.queries = queries;
  }

  async get(params?: Record<string, string>) {
    try {
      const tasks = await this.queries.get(params);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new HttpError(500, 'Error fetching tasks');
    }
  }

  async getById(id: string) {
    try {
      const task = await this.queries.getById(id);
      if (!task) {
        throw new HttpError(404, 'task not found');
      }
      return task;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error fetching task:', error);
      throw new HttpError(500, 'Error fetching task');
    }
  }

  async create(data: TaskToInsert) {
    try {
      const task = await this.queries.create(this.buildTaskToInsert(data));
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new HttpError(500, 'Error creating task');
    }
  }

  async update(id: string, data: Partial<TaskToInsert>) {
    try {
      const updatedTask = await this.queries.update(id, this.buildTaskRowUpdate(data));

      if (!updatedTask) {
        throw new HttpError(404, 'task not found');
      }

      return updatedTask;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error updating task:', error);
      throw new HttpError(500, 'Error updating task');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.queries.delete(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        throw new HttpError(404, 'task not found');
      }
      throw new HttpError(500, 'Error deleting task');
    }
  }

  private buildTaskToInsert(data: TaskToInsert): TaskRowInsert {
    return {
      description: data.description || '',
      title: data.title,
      status: data.status,
      due_date: data.dueDate || new Date().toISOString(),
      estimated_pomodoros: data.estimatedPomodoros || 0,
      completed_pomodoros: data.completedPomodoros || 0,
      priority: data.priority
    };
  }

  private buildTaskRowUpdate(data: Partial<TaskToInsert>): TaskRowUpdate {
    const updateData: TaskRowUpdate = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
    if (data.estimatedPomodoros !== undefined) updateData.estimated_pomodoros = data.estimatedPomodoros;
    if (data.completedPomodoros !== undefined) updateData.completed_pomodoros = data.completedPomodoros;
    if (data.priority !== undefined) updateData.priority = data.priority;

    return updateData;
  }
}
