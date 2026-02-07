import { ContrastMode } from "../enums/contrast-mode.enum.js";
import { Size } from "../enums/size.enum.js";
import { ViewMode } from "../enums/view-mode.enum.js";

export interface ISettings {
  pomodoroDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  longBreakAfterPomodoros: number;
  viewMode: ViewMode;
  contrastMode: ContrastMode;
  spacing: Size;
  fontSize: Size;
}