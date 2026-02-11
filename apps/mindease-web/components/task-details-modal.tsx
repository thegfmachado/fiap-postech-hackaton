"use client";

import { X, Clock, Calendar, Tag, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, Label, Input } from "@mindease/design-system/components";
import { Task } from "@mindease/models";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const statusLabels = {
  todo: "A Fazer",
  doing: "Em Andamento",
  done: "Concluído",
};

export function TaskDetailsModal({ task, onClose, onSave, onDelete }: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleIncreasePomodoro = () => {
    if (editedTask.completedPomodoros < editedTask.estimatedPomodoros) {
      setEditedTask({
        ...editedTask,
        completedPomodoros: editedTask.completedPomodoros + 1,
      });
    }
  };

  const handleDecreasePomodoro = () => {
    if (editedTask.completedPomodoros > 0) {
      setEditedTask({
        ...editedTask,
        completedPomodoros: editedTask.completedPomodoros - 1,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-xl font-bold"
                  placeholder="Título da tarefa"
                />
              ) : (
                <h2 className="text-2xl font-bold">{task.title}</h2>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Descrição */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Descrição</Label>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full min-h-24 p-3 border rounded-md text-sm"
                placeholder="Adicione uma descrição..."
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {task.description || "Sem descrição"}
              </p>
            )}
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Status
              </Label>
              {isEditing ? (
                <select
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task["status"] })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="todo">A Fazer</option>
                  <option value="doing">Em Andamento</option>
                  <option value="done">Concluído</option>
                </select>
              ) : (
                <p className="text-sm text-muted-foreground">{statusLabels[task.status]}</p>
              )}
            </div>

            {/* Prioridade */}
            <div>
              <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Prioridade
              </Label>
              {isEditing ? (
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task["priority"] })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              ) : (
                <span className={`inline-block text-xs px-3 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                  {priorityLabels[task.priority]}
                </span>
              )}
            </div>
          </div>

          {/* Pomodoros */}
          <div>
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pomodoros
            </Label>
            <div className="space-y-3">
              {/* Estimados */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimados</span>
                {isEditing ? (
                  <Input
                    type="number"
                    min="1"
                    value={editedTask.estimatedPomodoros}
                    onChange={(e) => setEditedTask({ ...editedTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                    className="w-20 text-center"
                  />
                ) : (
                  <span className="font-semibold">{task.estimatedPomodoros}</span>
                )}
              </div>

              {/* Completados */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completados</span>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleDecreasePomodoro}
                        disabled={editedTask.completedPomodoros === 0}
                      >
                        -
                      </Button>
                    </>
                  )}
                  <span className="font-semibold w-12 text-center">
                    {isEditing ? editedTask.completedPomodoros : task.completedPomodoros}
                  </span>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleIncreasePomodoro}
                      disabled={editedTask.completedPomodoros >= editedTask.estimatedPomodoros}
                    >
                      +
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{
                      width: `${(task.completedPomodoros / task.estimatedPomodoros) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round((task.completedPomodoros / task.estimatedPomodoros) * 100)}% completo
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Editar
                </Button>
                {onDelete && (
                  <Button
                    onClick={() => {
                      onDelete(task.id);
                      onClose();
                    }}
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive hover:text-white border-destructive"
                  >
                    Deletar
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
