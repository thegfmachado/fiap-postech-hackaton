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

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await tasksService.get();
      setTasks(response.data);
    };

    void fetchTasks();
  }, []);

  const handleAddTask = async (data: TaskToInsert) => {
    try {
      const createdTask = await tasksService.create(data);
      setTasks([...tasks, createdTask]);
    } catch (error) {
      console.error("Erro ao criar nova tarefa", error);
    } finally {
      setShowForm(false);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksService.delete(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao deletar tarefa", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const savedTask = await tasksService.update(updatedTask.id, updatedTask);

      setTasks(
        tasks.map((task) =>
          task.id === savedTask.id ? savedTask : task
        )
      );

      setSelectedTask(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
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

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
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
            />
          )}
        </div>
      </Main>
    </Layout>
  );
}
