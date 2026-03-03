"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { ChecklistItem as ChecklistItemType } from "@mindease/models";
import { Button } from "@mindease/design-system/components";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (completed: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export function ChecklistItemComponent({
  item,
  onToggle,
  onDelete,
  isLoading = false,
}: ChecklistItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleToggle = async () => {
    await onToggle(!item.completed);
  };

  const handleDelete = async () => {
    setIsRemoving(true);
    try {
      await onDelete();
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors">
      <input
        type="checkbox"
        checked={item.completed}
        onChange={handleToggle}
        disabled={isLoading}
        className="w-4 h-4 rounded cursor-pointer"
      />
      <span
        className={`flex-1 text-sm ${
          item.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {item.description}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isLoading || isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
