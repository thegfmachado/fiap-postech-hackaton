"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mindease/design-system/components";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  estimatedPomodoros: number;
  completedPomodoros: number;
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "completedPomodoros">) => void;
  onCancel?: () => void;
  initialValues?: Partial<Task>;
}

export function TaskForm({ onSubmit, onCancel, initialValues }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(initialValues?.priority || "medium");
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(initialValues?.estimatedPomodoros || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      status: initialValues?.status || "todo",
      priority,
      estimatedPomodoros,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEstimatedPomodoros(1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{initialValues ? "Editar Tarefa" : "Nova Tarefa"}</CardTitle>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pomodoros">Pomodoros Estimados</Label>
              <Input
                id="pomodoros"
                type="number"
                min="1"
                max="10"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              {initialValues ? "Salvar" : "Adicionar Tarefa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
