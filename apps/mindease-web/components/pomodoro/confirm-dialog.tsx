"use client";

import { Button, Card, CardContent } from "@mindease/design-system/components";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  infoOnly?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  destructive = false,
  infoOnly = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <Card className="relative z-10 w-full max-w-sm mx-4">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            {!infoOnly && (
              <Button variant="outline" onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
            <Button
              variant={destructive ? "destructive" : "default"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
