import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePomodoroTimer } from './use-pomodoro-timer';

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.sessionsCompleted).toBe(0);
  });

  test('should start and pause the timer', () => {
    const { result } = renderHook(() => usePomodoroTimer());

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
    const { result } = renderHook(() => usePomodoroTimer());

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
    const { result } = renderHook(() => usePomodoroTimer());

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

  test('should change to break mode after completing a work pomodoro', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.sessionsCompleted).toBe(1);
    expect(result.current.timeLeft).toBe(5 * 60);
  });

  test('should change to long break after 4 completed sessions', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    for (let i = 0; i < 4; i++) {
      act(() => {
        result.current.changeMode('work');
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
      });
    }

    expect(result.current.mode).toBe('longBreak');
    expect(result.current.sessionsCompleted).toBe(4);
  });

  test('should format time correctly', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    expect(result.current.formatTime(0)).toBe('00:00');
    expect(result.current.formatTime(60)).toBe('01:00');
    expect(result.current.formatTime(125)).toBe('02:05');
    expect(result.current.formatTime(3661)).toBe('61:01');
  });

  test('should calculate progress correctly', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(12.5 * 60 * 1000); // 50% of time
    });

    expect(result.current.progress).toEqual(50);
  });

  test('should update settings', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    const newSettings = {
      work: 30,
      break: 10,
      longBreak: 20,
      sessionsBeforeLongBreak: 3,
    };

    act(() => {
      result.current.setSettings(newSettings);
    });

    expect(result.current.settings).toEqual(newSettings);
  });

  test('should initialize with custom settings', () => {
    const customSettings = {
      work: 50,
      break: 10,
      longBreak: 30,
      sessionsBeforeLongBreak: 2,
    };

    const { result } = renderHook(() => usePomodoroTimer(customSettings));

    expect(result.current.settings).toEqual(customSettings);
    expect(result.current.timeLeft).toBe(50 * 60);
  });

  test('should load settings from localStorage on init', () => {
    const savedSettings = {
      work: 40,
      break: 8,
      longBreak: 25,
      sessionsBeforeLongBreak: 3,
    };
    localStorage.setItem('pomodoroSettings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => usePomodoroTimer());

    expect(result.current.settings).toEqual(savedSettings);
    expect(result.current.timeLeft).toBe(40 * 60);
  });

  test('should save settings to localStorage', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    const newSettings = {
      work: 30,
      break: 10,
      longBreak: 20,
      sessionsBeforeLongBreak: 3,
    };

    act(() => {
      result.current.setSettings(newSettings);
    });

    const stored = localStorage.getItem('pomodoroSettings');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(newSettings);
  });

  test('should change mode manually', () => {
    const { result } = renderHook(() => usePomodoroTimer());

    act(() => {
      result.current.changeMode('break');
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(5 * 60);
  });
});
