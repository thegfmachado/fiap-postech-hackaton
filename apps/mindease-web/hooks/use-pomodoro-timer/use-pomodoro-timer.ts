"use client";

import { UserSettings } from "@mindease/models";
import { useState, useEffect, useCallback } from "react";

export type TimerMode = "work" | "break" | "longBreak";

export interface UsePomodoroTimerReturn {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  settings: UserSettings;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (newMode: TimerMode) => void;
  setSettings: (settings: UserSettings) => void;
  formatTime: (seconds: number) => string;
}

export function usePomodoroTimer(
  initialSettings: UserSettings
): UsePomodoroTimerReturn {
  const [settings, setSettingsState] = useState<UserSettings>(
    initialSettings
  );

  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(
    initialSettings.pomodoroDurationMinutes * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const getTimeForMode = (timerMode: TimerMode, timerSettings: UserSettings): number => {
    switch (timerMode) {
      case "work":
        return timerSettings.pomodoroDurationMinutes * 60;
      case "break":
        return timerSettings.shortBreakDurationMinutes * 60;
      case "longBreak":
        return timerSettings.longBreakDurationMinutes * 60;
    }
  };

  useEffect(() => {
    setSettingsState(initialSettings);

    if (!isRunning) {
      setTimeLeft(getTimeForMode(mode, initialSettings));
    }
  }, [initialSettings, mode, isRunning]);

  const setSettings = (newSettings: UserSettings) => {
    setSettingsState(newSettings);
  };

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (mode === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);

      if (
        newSessions % settings.longBreakAfterPomodoros ===
        0
      ) {
        setMode("longBreak");
        setTimeLeft(settings.longBreakDurationMinutes * 60);
      } else {
        setMode("break");
        setTimeLeft(settings.shortBreakDurationMinutes * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(settings.pomodoroDurationMinutes * 60);
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
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getTimeForMode(mode, settings));
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getTimeForMode(newMode, settings));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalSeconds = getTimeForMode(mode, settings);

  const progress =
    ((totalSeconds - timeLeft) / totalSeconds) * 100;

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