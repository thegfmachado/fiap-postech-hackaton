import { ContrastMode } from "../enums/contrast-mode.enum.js";
import { Size } from "../enums/size.enum.js";
import { ViewMode } from "../enums/view-mode.enum.js";

export interface UserSettings {
  pomodoroDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakAfterPomodoros: number;
  viewMode: ViewMode;
  contrastMode: ContrastMode;
  spacing: Size;
  fontSize: Size;
}

export const defaultPomodoroSettings: UserSettings = {
  pomodoroDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  longBreakAfterPomodoros: 4,
  viewMode: ViewMode.detailed,
  contrastMode: ContrastMode.low,
  spacing: Size.medium,
  fontSize: Size.medium
};