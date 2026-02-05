import { useContext } from "react";
import { DisplayModeContext } from "@/contexts/display-mode-context";

export function useDisplayMode() {
  const context = useContext(DisplayModeContext);

  if (!context) {
    throw new Error("useDisplayMode must be used within a DisplayModeProvider");
  }

  return context;
}
