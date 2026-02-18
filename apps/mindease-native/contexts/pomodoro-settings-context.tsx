import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  defaultPomodoroSettings,
  type PomodoroSettings,
  POMODORO_SETTINGS_KEY,
} from "@/hooks/usePomodoroTimer";

interface PomodoroSettingsContextValue {
  settings: PomodoroSettings;
  updateSettings: (newSettings: PomodoroSettings) => void;
}

const PomodoroSettingsContext = createContext<PomodoroSettingsContextValue | undefined>(undefined);

export function PomodoroSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultPomodoroSettings);

  useEffect(() => {
    AsyncStorage.getItem(POMODORO_SETTINGS_KEY).then((stored) => {
      if (stored) {
        try {
          setSettings(JSON.parse(stored));
        } catch {}
      }
    });
  }, []);

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    AsyncStorage.setItem(POMODORO_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <PomodoroSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </PomodoroSettingsContext.Provider>
  );
}

export function usePomodoroSettingsContext() {
  const ctx = useContext(PomodoroSettingsContext);
  if (!ctx) {
    throw new Error("usePomodoroSettingsContext must be used within a PomodoroSettingsProvider");
  }
  return ctx;
}
