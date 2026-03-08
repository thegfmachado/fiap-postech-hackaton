import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePomodoroTimer } from './use-pomodoro-timer';
import { UserSettings, ViewMode, ContrastMode, Size } from '@mindease/models';

const defaultSettings: UserSettings = {
  pomodoroDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  longBreakAfterPomodoros: 4,
  viewMode: ViewMode.detailed,
  contrastMode: ContrastMode.low,
  spacing: Size.medium,
  fontSize: Size.medium,
};

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.sessionsCompleted).toBe(0);
    expect(result.current.pomodoroMode).toBe('free');
    expect(result.current.targetPomodoros).toBe(0);
    expect(result.current.isTaskComplete).toBe(false);
  });

  test('should start and pause the timer', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.isRunning).toBe(false);
  });

  test('should decrement time when timer is running', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.toggleTimer();
    });

    const initialTime = result.current.timeLeft;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(initialTime - 3);
  });

  test('should reset the timer', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  test('should change to break mode and auto-start after completing a work pomodoro', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.sessionsCompleted).toBe(1);
    expect(result.current.timeLeft).toBe(5 * 60);
    expect(result.current.isRunning).toBe(true);
  });

  test('should auto-start work after break completes', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    // Complete a work session
    act(() => {
      result.current.toggleTimer();
    });
    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.isRunning).toBe(true);

    // Let the break complete
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(result.current.mode).toBe('work');
    expect(result.current.isRunning).toBe(true);
  });

  test('should change to long break after 4 completed sessions', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    for (let i = 0; i < 4; i++) {
      // Work session
      if (!result.current.isRunning) {
        act(() => {
          result.current.toggleTimer();
        });
      }

      act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
      });

      if (i < 3) {
        // Break auto-starts, let it complete
        act(() => {
          vi.advanceTimersByTime(5 * 60 * 1000);
        });
      }
    }

    expect(result.current.mode).toBe('longBreak');
    expect(result.current.sessionsCompleted).toBe(4);
    expect(result.current.timeLeft).toBe(15 * 60);
  });

  test('should format time correctly', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    expect(result.current.formatTime(0)).toBe('00:00');
    expect(result.current.formatTime(60)).toBe('01:00');
    expect(result.current.formatTime(125)).toBe('02:05');
    expect(result.current.formatTime(3661)).toBe('61:01');
  });

  test('should calculate progress correctly', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(12.5 * 60 * 1000);
    });

    expect(Math.round(result.current.progress)).toBe(50);
  });

  test('should update settings', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    const newSettings: UserSettings = {
      ...defaultSettings,
      pomodoroDurationMinutes: 30,
      shortBreakDurationMinutes: 10,
      longBreakDurationMinutes: 20,
      longBreakAfterPomodoros: 3,
    };

    act(() => {
      result.current.setSettings(newSettings);
    });

    expect(result.current.settings).toEqual(newSettings);
  });

  test('should initialize with custom settings', () => {
    const customSettings: UserSettings = {
      ...defaultSettings,
      pomodoroDurationMinutes: 50,
      shortBreakDurationMinutes: 10,
      longBreakDurationMinutes: 30,
      longBreakAfterPomodoros: 2,
    };

    const { result } = renderHook(() => usePomodoroTimer(customSettings));

    expect(result.current.settings).toEqual(customSettings);
    expect(result.current.timeLeft).toBe(50 * 60);
  });

  test('should change mode manually', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.changeMode('break');
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(5 * 60);
  });

  // --- Task mode tests ---

  test('startTaskSession should initialize task mode correctly', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.startTaskSession(5, 2);
    });

    expect(result.current.pomodoroMode).toBe('task');
    expect(result.current.targetPomodoros).toBe(5);
    expect(result.current.sessionsCompleted).toBe(2);
    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isTaskComplete).toBe(false);
  });

  test('startFreeSession should reset to free mode', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    // First enter task mode
    act(() => {
      result.current.startTaskSession(5, 2);
    });

    // Then switch to free
    act(() => {
      result.current.startFreeSession();
    });

    expect(result.current.pomodoroMode).toBe('free');
    expect(result.current.targetPomodoros).toBe(0);
    expect(result.current.sessionsCompleted).toBe(0);
    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  test('stopSession should reset all state', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.stopSession();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.sessionsCompleted).toBe(0);
  });

  test('should fire onPomodoroComplete callback when a work session finishes', () => {
    const onPomodoroComplete = vi.fn();
    const { result } = renderHook(() =>
      usePomodoroTimer(defaultSettings, { onPomodoroComplete })
    );

    act(() => {
      result.current.startTaskSession(4, 0);
    });

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(onPomodoroComplete).toHaveBeenCalledWith(1);
  });

  test('should fire onAllPomodorosComplete when sessions reach target', () => {
    const onPomodoroComplete = vi.fn();
    const onAllPomodorosComplete = vi.fn();
    const { result } = renderHook(() =>
      usePomodoroTimer(defaultSettings, { onPomodoroComplete, onAllPomodorosComplete })
    );

    act(() => {
      result.current.startTaskSession(1, 0);
    });

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(onPomodoroComplete).toHaveBeenCalledWith(1);
    expect(onAllPomodorosComplete).toHaveBeenCalled();
  });

  test('should NOT auto-start after all pomodoros complete in task mode', () => {
    const onAllPomodorosComplete = vi.fn();
    const { result } = renderHook(() =>
      usePomodoroTimer(defaultSettings, { onAllPomodorosComplete })
    );

    act(() => {
      result.current.startTaskSession(1, 0);
    });

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(onAllPomodorosComplete).toHaveBeenCalled();
    // Timer should stop, not auto-start a break
    expect(result.current.isRunning).toBe(false);
  });

  test('isTaskComplete should be true when sessions reach target', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    act(() => {
      result.current.startTaskSession(1, 0);
    });

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.isTaskComplete).toBe(true);
    expect(result.current.sessionsCompleted).toBe(1);
  });

  test('isTaskComplete should be false in free mode', () => {
    const { result } = renderHook(() => usePomodoroTimer(defaultSettings));

    // Complete a pomodoro in free mode
    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.isTaskComplete).toBe(false);
  });
});