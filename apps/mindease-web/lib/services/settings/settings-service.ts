import { HttpError } from "@mindease/services";
import type { ISettingsUpdate, ITaskInsert, ITaskUpdate } from '@mindease/database/types';
import { Priority, UserSettings, Status, TaskToInsert } from "@mindease/models";
import { ISettingsQueries } from "@mindease/database/queries";
import { ISettingsService } from "./settings-service.interface";

export class SettingsService implements ISettingsService {
  private readonly queries: ISettingsQueries

  constructor(queries: ISettingsQueries) {
    this.queries = queries;
  }

  async getById(id: string) {
    try {
      const settings = await this.queries.getById(id);
      if (!settings) {
        throw new HttpError(404, 'settings not found');
      }
      return settings;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error fetching settings:', error);
      throw new HttpError(500, 'Error fetching task');
    }
  }

  async update(id: string, data: UserSettings) {
    try {
      const updatedSettings = await this.queries.update(id, this.buildSettingsToInsert(data));

      if (!updatedSettings) {
        throw new HttpError(404, 'settings not found');
      }

      return updatedSettings;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error updating settings:', error);
      throw new HttpError(500, 'Error updating settings');
    }
  }

  private buildSettingsToInsert(data: UserSettings): ISettingsUpdate {
    return {
      pomodoro_duration_minutes: data.pomodoroDurationMinutes,
      short_break_minutes: data.shortBreakDurationMinutes,
      long_break_minutes: data.longBreakDurationMinutes,
      long_break_after_pomodoros: data.longBreakAfterPomodoros,
      view_mode: data.viewMode ?? null,
      contrast_intensity: data.contrastMode ?? null,
      spacing: data.spacing ?? null,
      font_size: data.fontSize ?? null,
    }
  }
}
