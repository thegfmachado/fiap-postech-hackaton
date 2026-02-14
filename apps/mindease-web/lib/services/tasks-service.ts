import { ITasksQueries } from "@mindease/database/queries";
import { HttpError } from "@mindease/services";
import { ITaskService } from "./tasks-service.interface";
import type { ITaskInsert } from '@mindease/database/types';
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

  async create(data: TaskToInsert) {
    try {
      const taskToInsert: ITaskInsert = {
        description: data.description || '',
        title: data.title,
        status: data.status || 'todo',
        due_date: data.dueDate || new Date().toISOString(),
        estimated_pomodoros: data.estimatedPomodoros || 0,
        completed_pomodoros: data.completedPomodoros || 0,
        priority: data.priority || 'low'
      };

      const task = await this.queries.create(taskToInsert);
      return task;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new HttpError(500, 'Error creating transaction');
    }
  }
}
