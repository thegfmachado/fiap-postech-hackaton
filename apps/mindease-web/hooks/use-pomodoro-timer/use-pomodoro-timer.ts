"use client";

import { UserSettings } from "@mindease/models";
import { useState, useEffect, useCallback, useRef } from "react";

export type TimerMode = "work" | "break" | "longBreak";
export type PomodoroMode = "task" | "free";

export interface PomodoroTimerCallbacks {
  onPomodoroComplete?: (sessionsCompleted: number) => void;
  onAllPomodorosComplete?: () => void;
}

export interface UsePomodoroTimerReturn {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  settings: UserSettings;
  progress: number;
  pomodoroMode: PomodoroMode;
  targetPomodoros: number;
  isTaskComplete: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (newMode: TimerMode) => void;
  setSettings: (settings: UserSettings) => void;
  formatTime: (seconds: number) => string;
  startTaskSession: (estimatedPomodoros: number, alreadyCompleted: number) => void;
  startFreeSession: () => void;
  stopSession: () => void;
}

function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function usePomodoroTimer(
  initialSettings: UserSettings,
  callbacks?: PomodoroTimerCallbacks
): UsePomodoroTimerReturn {
  const [settings, setSettingsState] = useState<UserSettings>(
    initialSettings
  );

  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(
    minutesToSeconds(initialSettings.pomodoroDurationMinutes)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>("free");
  const [targetPomodoros, setTargetPomodoros] = useState<number>(0);

  const callbacksRef = useRef(callbacks);
  const isRunningRef = useRef(isRunning);
  const modeRef = useRef(mode);

  useEffect(() => { callbacksRef.current = callbacks; }, [callbacks]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const getTimeForMode = (timerMode: TimerMode, timerSettings: UserSettings): number => {
    switch (timerMode) {
      case "work":
        return minutesToSeconds(timerSettings.pomodoroDurationMinutes);
      case "break":
        return minutesToSeconds(timerSettings.shortBreakDurationMinutes);
      case "longBreak":
        return minutesToSeconds(timerSettings.longBreakDurationMinutes);
    }
  };

  useEffect(() => {
    setSettingsState(initialSettings);

    if (!isRunningRef.current) {
      setTimeLeft(getTimeForMode(modeRef.current, initialSettings));
    }
  }, [initialSettings]);

  const setSettings = (newSettings: UserSettings) => {
    setSettingsState(newSettings);
  };

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (mode === "work") {
      setSessionsCompleted((prev) => {
        const newSessions = prev + 1;

        callbacksRef.current?.onPomodoroComplete?.(newSessions);

        if (pomodoroMode === "task" && targetPomodoros > 0) {
          if (newSessions >= targetPomodoros) {
            callbacksRef.current?.onAllPomodorosComplete?.();
            return newSessions;
          }
        }

        if (
          newSessions % settings.longBreakAfterPomodoros ===
          0
        ) {
          setMode("longBreak");
          setTimeLeft(minutesToSeconds(settings.longBreakDurationMinutes));
        } else {
          setMode("break");
          setTimeLeft(minutesToSeconds(settings.shortBreakDurationMinutes));
        }

        setIsRunning(true);

        return newSessions;
      });
    } else {
      setMode("work");
      setTimeLeft(minutesToSeconds(settings.pomodoroDurationMinutes));

      setIsRunning(true);
    }
  }, [mode, settings, pomodoroMode, targetPomodoros]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
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

  const startTaskSession = (estimatedPomodoros: number, alreadyCompleted: number) => {
    setPomodoroMode("task");
    setTargetPomodoros(estimatedPomodoros);
    setSessionsCompleted(alreadyCompleted);
    setMode("work");
    setTimeLeft(minutesToSeconds(settings.pomodoroDurationMinutes));
    setIsRunning(false);
  };

  const startFreeSession = () => {
    setPomodoroMode("free");
    setTargetPomodoros(0);
    setSessionsCompleted(0);
    setMode("work");
    setTimeLeft(minutesToSeconds(settings.pomodoroDurationMinutes));
    setIsRunning(false);
  };

  const stopSession = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(minutesToSeconds(settings.pomodoroDurationMinutes));
    setSessionsCompleted(0);
  };

  const totalSeconds = getTimeForMode(mode, settings);

  const progress =
    ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const isTaskComplete =
    pomodoroMode === "task" &&
    targetPomodoros > 0 &&
    sessionsCompleted >= targetPomodoros;

  return {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    settings,
    progress,
    pomodoroMode,
    targetPomodoros,
    isTaskComplete,
    toggleTimer,
    resetTimer,
    changeMode,
    setSettings,
    formatTime,
    startTaskSession,
    startFreeSession,
    stopSession,
  };
}