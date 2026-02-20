import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Priority, Status, Task } from '@mindease/models';
import { TaskCard } from './task-card';

// Mock the useDisplayMode hook
vi.mock('@/hooks/use-display-mode', () => ({
  useDisplayMode: () => ({ isSimplified: false }),
}));

describe('TaskCard', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Teste de tarefa',
    description: 'Descrição da tarefa de teste',
    priority: Priority.medium,
    status: Status.todo,
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  test('should render task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Teste de tarefa')).toBeInTheDocument();
  });

  test('should render task description', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Descrição da tarefa de teste')).toBeInTheDocument();
  });

  test('should display correct priority', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Média')).toBeInTheDocument();
  });

  test('should display pomodoros counter', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('2/4 pomodoros')).toBeInTheDocument();
  });

  test('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskCard task={mockTask} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /deletar tarefa/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /editar tarefa/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('should call onView when card is clicked', () => {
    const onView = vi.fn();
    render(<TaskCard task={mockTask} onView={onView} />);

    const card = screen.getByText('Teste de tarefa').closest('.cursor-move');
    if (card) {
      fireEvent.click(card);
    }

    expect(onView).toHaveBeenCalledWith(mockTask);
  });

  test('should have correct colors for each priority', () => {
    const { rerender } = render(<TaskCard task={{ ...mockTask, priority: Priority.low }} />);
    expect(screen.getByText('Baixa')).toHaveClass('bg-blue-100');

    rerender(<TaskCard task={{ ...mockTask, priority: Priority.high }} />);
    expect(screen.getByText('Alta')).toHaveClass('bg-red-100');
  });

  test('should be draggable when draggable prop is true', () => {
    const onDragStart = vi.fn();
    render(<TaskCard task={mockTask} draggable onDragStart={onDragStart} />);

    const card = screen.getByText('Teste de tarefa').closest('[draggable="true"]');
    expect(card).toHaveAttribute('draggable', 'true');
  });
});
