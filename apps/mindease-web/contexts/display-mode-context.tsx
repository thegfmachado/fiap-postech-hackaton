"use client";

import * as React from "react";

export type DisplayMode = "detailed" | "simplified";

type DisplayModeContextType = {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  isSimplified: boolean;
  isDetailed: boolean;
};

export const DisplayModeContext = React.createContext<DisplayModeContextType | undefined>(undefined);

export function DisplayModeProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayModeState] = React.useState<DisplayMode>(() => {
    // Tenta recuperar do localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("displayMode");
      return (stored as DisplayMode) || "detailed";
    }
    return "detailed";
  });

  const setDisplayMode = React.useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("displayMode", mode);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      displayMode,
      setDisplayMode,
      isSimplified: displayMode === "simplified",
      isDetailed: displayMode === "detailed",
    }),
    [displayMode, setDisplayMode]
  );

  return (
    <DisplayModeContext.Provider value={value}>
      {children}
    </DisplayModeContext.Provider>
  );
}
