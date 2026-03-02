import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DisplayMode = "detailed" | "simplified";

type DisplayModeContextType = {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  isSimplified: boolean;
  isDetailed: boolean;
};

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);

const STORAGE_KEY = "mindease_display_mode";

export function DisplayModeProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>("detailed");

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "detailed" || stored === "simplified") {
        setDisplayModeState(stored);
      }
    });
  }, []);

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const value = useMemo(
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

export function useDisplayMode() {
  const context = useContext(DisplayModeContext);
  if (!context) {
    throw new Error("useDisplayMode must be used within a DisplayModeProvider");
  }
  return context;
}
