"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "@/components/template/header";
import { Layout } from "@/components/template/layout";
import { Main } from "@/components/template/main";
import { Sidebar } from "@/components/template/sidebar";
import { TaskForm } from "@/components/task-form";
import { TaskCard } from "@/components/task-card/task-card";
import { TaskDetailsModal } from "@/components/task-details-modal";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@mindease/design-system/components";
import { Task, Status, TaskToInsert } from "@mindease/models";
import { HTTPService } from "@mindease/services";
import { TasksService } from "@/client/services/task-service";

const columnTitles: Record<Status, string> = {
  [Status.todo]: "A fazer",
  [Status.doing]: "Em andamento",
  [Status.done]: "Concluído",
};

const httpService = new HTTPService();
const tasksService = new TasksService(httpService);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await tasksService.get();
        setTasks(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar tarefas", err);
        setError("Não foi possível carregar as tarefas. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTasks();
  }, []);

  const handleAddTask = async (data: TaskToInsert) => {
    try {
      const { checklistItems, ...taskData } = data;
      const createdTask = await tasksService.create(taskData);
      
      if (checklistItems && checklistItems.length > 0) {
        const createdItems = await tasksService.createChecklistItem(createdTask.id, checklistItems.map(item => item.description));

        createdTask.checklistItems = createdItems;
      }
      
      setTasks((prev) => [...prev, createdTask]);
    } catch (error) {
      console.error("Erro ao criar nova tarefa", error);
    } finally {
      setShowForm(false);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksService.delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const savedTask = await tasksService.update(updatedTask.id, updatedTask);

      setTasks((prev) => prev.map((task) => (task.id === savedTask.id ? savedTask : task)));

      setSelectedTask(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleChecklistToggle = async (taskId: string, itemId: string, completed: boolean) => {
    try {
      const updatedItem = await tasksService.updateChecklistItem(taskId, itemId, completed);
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId && task.checklistItems) {
            return {
              ...task,
              checklistItems: task.checklistItems.map((item) =>
                item.id === itemId ? updatedItem : item
              ),
            };
          }
          return task;
        })
      );
      
      setSelectedTask((current) => {
        if (current && current.id === taskId && current.checklistItems) {
          return {
            ...current,
            checklistItems: current.checklistItems.map((item) =>
              item.id === itemId ? updatedItem : item
            ),
          };
        }
        return current;
      });
    } catch (error) {
      console.error("Erro ao atualizar item da checklist", error);
    }
  };

  const handleChecklistDelete = async (taskId: string, itemId: string) => {
    try {
      await tasksService.deleteChecklistItem(taskId, itemId);
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === taskId && task.checklistItems) {
            return {
              ...task,
              checklistItems: task.checklistItems.filter((item) => item.id !== itemId),
            };
          }
          return task;
        })
      );
      
      setSelectedTask((current) => {
        if (current && current.id === taskId && current.checklistItems) {
          return {
            ...current,
            checklistItems: current.checklistItems.filter((item) => item.id !== itemId),
          };
        }
        return current;
      });
    } catch (error) {
      console.error("Erro ao deletar item da checklist", error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: Task["status"]) => {
    e.preventDefault();

    if (!draggedTaskId) return;

    try {
      const updatedTask = await tasksService.update(draggedTaskId, {
        status: newStatus,
      });

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa", error);
    } finally {
      setDraggedTaskId(null);
    }
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <Layout>
      <Header />
      <Sidebar />
      <Main>
        <div className="flex flex-col w-full p-4 md:p-8 gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quadro de Atividades</h1>
              <p className="text-muted-foreground mt-1">
                Organize suas tarefas de forma visual e acessível
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          {showForm && (
            <TaskForm
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          )}

          {isLoading && (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                Carregando tarefas...
              </CardContent>
            </Card>
          )}

          {error && !isLoading && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-6 text-sm text-destructive">
                {error}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {(Object.values(Status)).map((status) => (
              <div
                key={status}
                className="flex flex-col gap-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{columnTitles[status]}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {getTasksByStatus(status).length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-50">
                    {getTasksByStatus(status).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={handleDeleteTask}
                        onView={handleViewTask}
                        onDragStart={handleDragStart}
                        draggable
                      />
                    ))}
                    {getTasksByStatus(status).length === 0 && (
                      <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                        Nenhuma tarefa
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {selectedTask && (
            <TaskDetailsModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onSave={handleUpdateTask}
              onDelete={handleDeleteTask}
              onChecklistToggle={handleChecklistToggle}
              onChecklistDelete={handleChecklistDelete}
            />
          )}
        </div>
      </Main>
    </Layout>
  );
}
