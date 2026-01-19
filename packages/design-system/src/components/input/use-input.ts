import { useState } from "react"
import { cn } from "../../lib/utils"
import type { InputProps } from "./input.types"

export function useInput({ className, type, isPassword, ...props }: InputProps) {
  const [visible, setVisible] = useState(false)

  const handleSetVisible = () => {
    setVisible(!visible)
  }

  return {
    className: cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    ),
    isPassword,
    visible,
    handleSetVisible,
    type: isPassword ? (visible ? "text" : "password") : type,
    ...props,
  }
}
