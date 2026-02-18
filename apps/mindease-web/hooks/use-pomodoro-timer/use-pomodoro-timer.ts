"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { StorageService } from "@mindease/services";

export type TimerMode = "work" | "break" | "longBreak";

export interface PomodoroSettings {
  work: number;
  break: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

export const defaultPomodoroSettings: PomodoroSettings = {
  work: 25,
  break: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
};

export interface UsePomodoroTimerReturn {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  settings: PomodoroSettings;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (newMode: TimerMode) => void;
  setSettings: (settings: PomodoroSettings) => void;
  formatTime: (seconds: number) => string;
}

const STORAGE_KEY = "pomodoroSettings";

export function usePomodoroTimer(
  initialSettings: PomodoroSettings = defaultPomodoroSettings
): UsePomodoroTimerReturn {
  const storage = useMemo(() => new StorageService(), []);

  const [settings, setSettingsState] = useState(() => {
    const stored = storage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PomodoroSettings;
    }
    return initialSettings;
  });
  
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const setSettings = (newSettings: PomodoroSettings) => {
    setSettingsState(newSettings);
    storage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (mode === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);

      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode("break");
        setTimeLeft(settings.break * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(settings.work * 60);
    }
  }, [mode, sessionsCompleted, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode] * 60);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((settings[mode] * 60 - timeLeft) / (settings[mode] * 60)) * 100;

  return {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    settings,
    progress,
    toggleTimer,
    resetTimer,
    changeMode,
    setSettings,
    formatTime,
  };
}
