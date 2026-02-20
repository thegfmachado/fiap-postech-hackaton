import { useContext } from "react";
import { DisplayModeContext, DisplayModeContextType } from "@/contexts/display-mode-context/display-mode-context";

export function useDisplayMode(): DisplayModeContextType {
  const context = useContext(DisplayModeContext);

  if (!context) {
    throw new Error("useDisplayMode must be used within a DisplayModeProvider");
  }

  return context;
}
