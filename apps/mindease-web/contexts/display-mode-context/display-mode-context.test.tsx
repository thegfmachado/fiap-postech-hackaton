import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DisplayModeProvider, DisplayModeContext } from './display-mode-context';
import { useContext } from 'react';
import { ViewMode, ContrastMode, Size, UserSettings } from '@mindease/models';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserSettings } from '@/hooks/use-user-settings';

vi.mock('@/hooks/use-current-user');
vi.mock('@/hooks/use-user-settings');

describe('DisplayModeContext', () => {
  const mockUseCurrentUser = vi.mocked(useCurrentUser);
  const mockUseUserSettings = vi.mocked(useUserSettings);
  const updateSettingsMock = vi.fn();

  let mockUserSettings: UserSettings = {
    pomodoroDurationMinutes: 25,
    shortBreakDurationMinutes: 5,
    longBreakDurationMinutes: 15,
    longBreakAfterPomodoros: 4,
    viewMode: ViewMode.detailed,
    contrastMode: ContrastMode.low,
    spacing: Size.medium,
    fontSize: Size.medium,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUserSettings = {
      pomodoroDurationMinutes: 25,
      shortBreakDurationMinutes: 5,
      longBreakDurationMinutes: 15,
      longBreakAfterPomodoros: 4,
      viewMode: ViewMode.detailed,
      contrastMode: ContrastMode.low,
      spacing: Size.medium,
      fontSize: Size.medium,
    };

    mockUseCurrentUser.mockReturnValue({
      user: { id: 'user-1' } as any,
      loading: false,
    });

    mockUseUserSettings.mockReturnValue({
      userSettings: mockUserSettings,
      updateSettings: updateSettingsMock,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should initialize with detailed mode by default', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.displayMode).toBe(ViewMode.detailed);
    expect(result.current?.isDetailed).toBe(true);
    expect(result.current?.isSimplified).toBe(false);
  });

  test('should load saved mode from hook', () => {
    mockUserSettings.viewMode = ViewMode.summary;

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.displayMode).toBe(ViewMode.summary);
    expect(result.current?.isSimplified).toBe(true);
    expect(result.current?.isDetailed).toBe(false);
  });

  test('should update display mode to simplified', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode(ViewMode.summary);
    });

    expect(updateSettingsMock).toHaveBeenCalledWith({
      ...mockUserSettings,
      viewMode: ViewMode.summary,
    });
  });

  test('should update display mode to detailed', () => {
    mockUserSettings.viewMode = ViewMode.summary;

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode(ViewMode.detailed);
    });

    expect(updateSettingsMock).toHaveBeenCalledWith({
      ...mockUserSettings,
      viewMode: ViewMode.detailed,
    });
  });

  test('should save mode when changed (via updateSettings)', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode(ViewMode.summary);
    });

    expect(updateSettingsMock).toHaveBeenCalledWith({
      ...mockUserSettings,
      viewMode: ViewMode.summary,
    });

    act(() => {
      result.current?.setDisplayMode(ViewMode.detailed);
    });

    expect(updateSettingsMock).toHaveBeenCalledWith({
      ...mockUserSettings,
      viewMode: ViewMode.detailed,
    });
  });

  test('should compute isSimplified correctly', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.isSimplified).toBe(false);

    mockUserSettings.viewMode = ViewMode.summary;

    const { result: displayMode } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(displayMode.current?.isSimplified).toBe(true);
  });

  test('should compute isDetailed correctly', () => {
    mockUserSettings.viewMode = ViewMode.summary;

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.isDetailed).toBe(false);

    mockUserSettings.viewMode = ViewMode.detailed;

    const { result: displayMode } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(displayMode.current?.isDetailed).toBe(true);
  });

  test('should provide context value to children', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('displayMode');
    expect(result.current).toHaveProperty('setDisplayMode');
    expect(result.current).toHaveProperty('isSimplified');
    expect(result.current).toHaveProperty('isDetailed');
    expect(typeof result.current?.setDisplayMode).toBe('function');
  });

  test('should maintain stable setDisplayMode reference', () => {
    const { result, rerender } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    const firstSetDisplayMode = result.current?.setDisplayMode;

    rerender();

    const secondSetDisplayMode = result.current?.setDisplayMode;

    expect(firstSetDisplayMode).toBe(secondSetDisplayMode);
  });
});