import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DisplayModeProvider, DisplayModeContext } from './display-mode-context';
import { useContext } from 'react';

describe('DisplayModeContext', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should initialize with detailed mode by default', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.displayMode).toBe('detailed');
    expect(result.current?.isDetailed).toBe(true);
    expect(result.current?.isSimplified).toBe(false);
  });

  test('should load saved mode from localStorage', () => {
    localStorageMock['displayMode'] = 'simplified';

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.displayMode).toBe('simplified');
    expect(result.current?.isSimplified).toBe(true);
    expect(result.current?.isDetailed).toBe(false);
  });

  test('should update display mode to simplified', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode('simplified');
    });

    expect(result.current?.displayMode).toBe('simplified');
    expect(result.current?.isSimplified).toBe(true);
    expect(result.current?.isDetailed).toBe(false);
  });

  test('should update display mode to detailed', () => {
    localStorageMock['displayMode'] = 'simplified';

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode('detailed');
    });

    expect(result.current?.displayMode).toBe('detailed');
    expect(result.current?.isDetailed).toBe(true);
    expect(result.current?.isSimplified).toBe(false);
  });

  test('should save mode to localStorage when changed', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    act(() => {
      result.current?.setDisplayMode('simplified');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('displayMode', 'simplified');
    expect(localStorageMock['displayMode']).toBe('simplified');

    act(() => {
      result.current?.setDisplayMode('detailed');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('displayMode', 'detailed');
    expect(localStorageMock['displayMode']).toBe('detailed');
  });

  test('should compute isSimplified correctly', () => {
    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.isSimplified).toBe(false);

    act(() => {
      result.current?.setDisplayMode('simplified');
    });

    expect(result.current?.isSimplified).toBe(true);
  });

  test('should compute isDetailed correctly', () => {
    localStorageMock['displayMode'] = 'simplified';

    const { result } = renderHook(() => useContext(DisplayModeContext), {
      wrapper: DisplayModeProvider,
    });

    expect(result.current?.isDetailed).toBe(false);

    act(() => {
      result.current?.setDisplayMode('detailed');
    });

    expect(result.current?.isDetailed).toBe(true);
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

    act(() => {
      result.current?.setDisplayMode('simplified');
    });

    rerender();

    const secondSetDisplayMode = result.current?.setDisplayMode;

    expect(firstSetDisplayMode).toBe(secondSetDisplayMode);
  });
});
