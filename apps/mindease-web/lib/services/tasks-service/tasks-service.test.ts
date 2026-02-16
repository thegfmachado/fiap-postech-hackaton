import { describe, test, expect, vi, beforeEach } from 'vitest';
import { TaskService } from './tasks-service';
import { HttpError } from '@mindease/services';
import { Priority, Status, Task } from '@mindease/models';
import type { ITasksQueries, GetAllTasksResponse } from '@mindease/database/queries';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockQueries: ITasksQueries;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: Status.todo,
    priority: Priority.medium,
    estimatedPomodoros: 4,
    completedPomodoros: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    mockQueries = {
      get: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any;

    taskService = new TaskService(mockQueries);
  });

  test('should return all tasks', async () => {
    const mockResponse: GetAllTasksResponse = {
      data: [mockTask],
      count: 1,
    };
    vi.mocked(mockQueries.get).mockResolvedValue(mockResponse);

    const result = await taskService.get();

    expect(result).toEqual(mockResponse);
    expect(mockQueries.get).toHaveBeenCalledWith(undefined);
  });

  test('should return tasks with params', async () => {
    const mockResponse: GetAllTasksResponse = {
      data: [mockTask],
      count: 1,
    };
    const params = { status: 'todo' };
    vi.mocked(mockQueries.get).mockResolvedValue(mockResponse);

    const result = await taskService.get(params);

    expect(result).toEqual(mockResponse);
    expect(mockQueries.get).toHaveBeenCalledWith(params);
  });

  test('should throw HttpError when getting tasks fails', async () => {
    vi.mocked(mockQueries.get).mockRejectedValue(new Error('Database error'));

    await expect(taskService.get()).rejects.toThrow(HttpError);
    await expect(taskService.get()).rejects.toThrow('Error fetching tasks');
  });

  test('should return task by id', async () => {
    vi.mocked(mockQueries.getById).mockResolvedValue(mockTask);

    const result = await taskService.getById('1');

    expect(result).toEqual(mockTask);
    expect(mockQueries.getById).toHaveBeenCalledWith('1');
  });

  test('should throw 404 when getting task by id not found', async () => {
    vi.mocked(mockQueries.getById).mockResolvedValue(null as any);

    try {
      await taskService.getById('999');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(404);
      expect((error as HttpError).message).toBe('task not found');
    }
  });

  test('should throw HttpError when getting task by id fails', async () => {
    vi.mocked(mockQueries.getById).mockRejectedValue(new Error('Database error'));

    try {
      await taskService.getById('1');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(500);
    }
  });

  test('should create a new task', async () => {
    const taskData = {
      title: 'New Task',
      description: 'New Description',
      status: Status.todo,
      priority: Priority.high,
      estimatedPomodoros: 3,
    };

    vi.mocked(mockQueries.create).mockResolvedValue(mockTask);

    const result = await taskService.create(taskData);

    expect(result).toEqual(mockTask);
    expect(mockQueries.create).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      status: Status.todo,
      priority: Priority.high,
      estimated_pomodoros: 3,
      completed_pomodoros: 0,
      due_date: expect.any(String),
    });
  });

  test('should create task with default values when optional fields are missing', async () => {
    const minimalTaskData = {
      title: 'Minimal Task',
    };

    vi.mocked(mockQueries.create).mockResolvedValue(mockTask);

    await taskService.create(minimalTaskData);

    expect(mockQueries.create).toHaveBeenCalledWith({
      title: 'Minimal Task',
      description: '',
      status: undefined,
      priority: undefined,
      estimated_pomodoros: 0,
      completed_pomodoros: 0,
      due_date: expect.any(String),
    });
  });

  test('should throw HttpError when creating task fails', async () => {
    vi.mocked(mockQueries.create).mockRejectedValue(new Error('Database error'));

    await expect(taskService.create({ title: 'Test' })).rejects.toThrow(HttpError);
    await expect(taskService.create({ title: 'Test' })).rejects.toThrow(
      'Error creating task'
    );
  });

  test('should update an existing task', async () => {
    const updateData = {
      title: 'Updated Task',
      description: 'Updated Description',
    };

    const updatedTask = { ...mockTask, ...updateData };
    vi.mocked(mockQueries.update).mockResolvedValue(updatedTask);

    const result = await taskService.update('1', updateData);

    expect(result).toEqual(updatedTask);
    expect(mockQueries.update).toHaveBeenCalledWith('1', {
      title: 'Updated Task',
      description: 'Updated Description',
      status: undefined,
      priority: undefined,
      estimated_pomodoros: 0,
      completed_pomodoros: 0,
      due_date: expect.any(String),
    });
  });

  test('should throw 404 when updating task not found', async () => {
    vi.mocked(mockQueries.update).mockResolvedValue(null as any);

    try {
      await taskService.update('999', { title: 'Test' });
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(404);
      expect((error as HttpError).message).toBe('task not found');
    }
  });

  test('should throw HttpError when updating task fails', async () => {
    vi.mocked(mockQueries.update).mockRejectedValue(new Error('Database error'));

    try {
      await taskService.update('1', { title: 'Test' });
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(500);
    }
  });

  test('should delete a task', async () => {
    vi.mocked(mockQueries.delete).mockResolvedValue(mockTask);

    await taskService.delete('1');

    expect(mockQueries.delete).toHaveBeenCalledWith('1');
  });

  test('should throw 404 when deleting task not found', async () => {
    vi.mocked(mockQueries.delete).mockRejectedValue(new Error('not found'));

    try {
      await taskService.delete('999');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(404);
      expect((error as HttpError).message).toBe('task not found');
    }
  });

  test('should throw HttpError when deleting task fails', async () => {
    vi.mocked(mockQueries.delete).mockRejectedValue(new Error('Database error'));

    try {
      await taskService.delete('1');
      expect.fail('Should have thrown HttpError');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).status).toBe(500);
    }
  });
});
