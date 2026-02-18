import { usePomodoroSettingsContext } from "@/contexts/pomodoro-settings-context";

/**
 * Returns the current pomodoro settings from context.
 * This is a thin wrapper around the context hook for backward compatibility.
 */
export function usePomodoroSettings() {
  const { settings } = usePomodoroSettingsContext();
  return settings;
}
