import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Haptics from "expo-haptics";

export type TimerMode = "work" | "break" | "longBreak";
export type PomodoroMode = "task" | "free";

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

export const POMODORO_SETTINGS_KEY = "mindease_pomodoro_settings";

export interface PomodoroTimerCallbacks {
  onPomodoroComplete?: (sessionsCompleted: number) => void;
  onAllPomodorosComplete?: () => void;
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export function usePomodoroTimer(
  initialSettings: PomodoroSettings = defaultPomodoroSettings,
  callbacks?: PomodoroTimerCallbacks
) {
  const [settings, setSettingsState] = useState<PomodoroSettings>(initialSettings);
  const [timerMode, setTimerMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(initialSettings.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const backgroundTimeRef = useRef<number | null>(null);
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>("free");
  const [targetPomodoros, setTargetPomodoros] = useState<number>(0);
  const isRunningRef = useRef(isRunning);
  const timerModeRef = useRef(timerMode);

  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { timerModeRef.current = timerMode; }, [timerMode]);

  useEffect(() => {
    setSettingsState(initialSettings);
    if (!isRunningRef.current) {
      setTimeLeft(initialSettings[timerModeRef.current] * 60);
    }
  }, [initialSettings]);

  useEffect(() => {
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "background" && isRunning) {
        backgroundTimeRef.current = Date.now();
      } else if (state === "active" && backgroundTimeRef.current && isRunning) {
        const elapsed = Math.floor(
          (Date.now() - backgroundTimeRef.current) / 1000
        );
        setTimeLeft((prev) => Math.max(0, prev - elapsed));
        backgroundTimeRef.current = null;
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [isRunning]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (timerMode === "work") {
      setSessionsCompleted((prev) => {
        const newSessions = prev + 1;

        callbacksRef.current?.onPomodoroComplete?.(newSessions);

        if (pomodoroMode === "task" && targetPomodoros > 0) {
          if (newSessions >= targetPomodoros) {
            callbacksRef.current?.onAllPomodorosComplete?.();
            return newSessions;
          }
        }

        if (newSessions % settings.sessionsBeforeLongBreak === 0) {
          setTimerMode("longBreak");
          setTimeLeft(settings.longBreak * 60);
        } else {
          setTimerMode("break");
          setTimeLeft(settings.break * 60);
        }

        setIsRunning(true);

        return newSessions;
      });
    } else {
      setTimerMode("work");
      setTimeLeft(settings.work * 60);

      setIsRunning(true);
    }
  }, [timerMode, settings, pomodoroMode, targetPomodoros]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

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
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[timerMode] * 60);
  };

  const changeMode = (newMode: TimerMode) => {
    setTimerMode(newMode);
    setIsRunning(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const startTaskSession = (estimatedPomodoros: number, alreadyCompleted: number) => {
    setPomodoroMode("task");
    setTargetPomodoros(estimatedPomodoros);
    setSessionsCompleted(alreadyCompleted);
    setTimerMode("work");
    setTimeLeft(settings.work * 60);
    setIsRunning(false);
  };

  const startFreeSession = () => {
    setPomodoroMode("free");
    setTargetPomodoros(0);
    setSessionsCompleted(0);
    setTimerMode("work");
    setTimeLeft(settings.work * 60);
    setIsRunning(false);
  };

  const stopSession = () => {
    setIsRunning(false);
    setTimerMode("work");
    setTimeLeft(settings.work * 60);
    setSessionsCompleted(0);
  };

  const totalDuration = settings[timerMode] * 60;
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const isTaskComplete =
    pomodoroMode === "task" &&
    targetPomodoros > 0 &&
    sessionsCompleted >= targetPomodoros;

  return {
    timerMode,
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
    formatTime,
    startTaskSession,
    startFreeSession,
    stopSession,
  };
}
