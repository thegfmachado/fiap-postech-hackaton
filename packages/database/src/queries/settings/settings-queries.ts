import { ContrastMode, UserSettings, Size, ViewMode, defaultPomodoroSettings } from "@mindease/models";
import { ISettings, ISettingsUpdate, TypedSupabaseClient } from "../../types.js";
import { ISettingsQueries } from "./settings-queries.interface.js";

export class SettingsQueriesService implements ISettingsQueries {
  static TABLE_NAME = 'settings' as const

  private client: TypedSupabaseClient

  constructor(client: TypedSupabaseClient) {
    this.client = client
  }

  async getById(id: string): Promise<UserSettings> {
    const { data, error } = await this.client
      .from(SettingsQueriesService.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    if (!data) {
      return this.create({
        contrast_intensity: defaultPomodoroSettings.contrastMode,
        font_size: defaultPomodoroSettings.fontSize,
        id: id,
        long_break_after_pomodoros: defaultPomodoroSettings.longBreakAfterPomodoros,
        long_break_minutes: defaultPomodoroSettings.longBreakDurationMinutes,
        pomodoro_duration_minutes: defaultPomodoroSettings.pomodoroDurationMinutes,
        short_break_minutes: defaultPomodoroSettings.shortBreakDurationMinutes,
        spacing: defaultPomodoroSettings.spacing,
        view_mode: defaultPomodoroSettings.viewMode,
      });
    }

    return this.dbSettingsToSettings(data);
  }

  async create(settingsToInsert: Omit<ISettings, 'created_at' | 'updated_at'>): Promise<UserSettings> {
    const { data, error } = await this.client
      .from(SettingsQueriesService.TABLE_NAME)
      .insert(settingsToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error creating settings: ${error.message}`);
    }

    return this.dbSettingsToSettings(data);
  }

  async update(id: string, settingsToUpdate: ISettingsUpdate): Promise<UserSettings> {
    const { data, error } = await this.client
      .from(SettingsQueriesService.TABLE_NAME)
      .update(settingsToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating settings: ${error.message}`);
    }

    return this.dbSettingsToSettings(data);
  }

  private dbSettingsToSettings(row: ISettings): UserSettings {
    return {
      pomodoroDurationMinutes: row.pomodoro_duration_minutes,
      shortBreakDurationMinutes: row.short_break_minutes,
      longBreakDurationMinutes: row.long_break_minutes,
      longBreakAfterPomodoros: row.long_break_after_pomodoros,

      viewMode: row.view_mode as ViewMode,
      contrastMode: row.contrast_intensity as ContrastMode,
      spacing: row.spacing as Size,
      fontSize: row.font_size as Size,
    }
  }
}
