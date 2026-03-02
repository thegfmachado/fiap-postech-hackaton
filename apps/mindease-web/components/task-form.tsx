"use client";

import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mindease/design-system/components";

import { Task, Priority, Status, ChecklistItem } from "@mindease/models";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "completedPomodoros"> & { checklistItems?: Omit<ChecklistItem, "id">[] }) => void;
  onCancel?: () => void;
  initialValues?: Partial<Task>;
}

export function TaskForm({ onSubmit, onCancel, initialValues }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(initialValues?.priority || Priority.medium);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(initialValues?.estimatedPomodoros || 1);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initialValues?.checklistItems || []);
  const [newChecklistDescription, setNewChecklistDescription] = useState("");

  const handleAddChecklistItem = () => {
    if (newChecklistDescription.trim()) {
      setChecklistItems([
        ...checklistItems,
        {
          description: newChecklistDescription,
          completed: false,
          id: `temp-${Date.now()}`,
        },
      ]);
      setNewChecklistDescription("");
    }
  };

  const handleRemoveChecklistItem = (id?: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      status: initialValues?.status || Status.todo,
      priority,
      estimatedPomodoros,
      checklistItems,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority(Priority.medium);
    setEstimatedPomodoros(1);
    setChecklistItems([]);
    setNewChecklistDescription("");
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

          <div className="space-y-2 border-t pt-4">
            <Label>Checklist</Label>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 bg-secondary p-2 rounded">
                  <span className="flex-1 text-sm">{item.description}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newChecklistDescription}
                  onChange={(e) => setNewChecklistDescription(e.target.value)}
                  placeholder="Adicione um item à checklist"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChecklistItem();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddChecklistItem}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
