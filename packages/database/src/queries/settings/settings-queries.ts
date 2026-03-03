import { createClient } from "@supabase/supabase-js";
import { ContrastMode, defaultPomodoroSettings, UserSettings, Size, ViewMode } from "@mindease/models";
import { Database, ISettings, ISettingsUpdate, TypedSupabaseClient } from "../../types.js";
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
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    if (!data) {
      return { ...defaultPomodoroSettings };
    }

    return this.dbSettingsToSettings(data);
  }

  async upsert(id: string, settingsToUpdate: ISettingsUpdate): Promise<UserSettings> {
    const { data: { user }, error: authError } = await this.client.auth.getUser();

    if (authError || !user) {
      throw new Error('Unable to get authenticated user for settings upsert');
    }

    if (id !== user.id) {
      throw new Error('Settings ID does not match authenticated user');
    }

    // Use service role client to bypass RLS for upsert — the settings table
    // only has SELECT/UPDATE policies; INSERT requires elevated privileges.
    const adminClient = createClient<Database>(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    );

    const { data, error } = await adminClient
      .from(SettingsQueriesService.TABLE_NAME)
      // Os tipos gerados incluem email/name (de outro projeto), mas a tabela real não tem essas colunas.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert({ id, ...settingsToUpdate } as any, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error upserting settings: ${error.message}`);
    }

    return this.dbSettingsToSettings(data);
  }

  async update(id: string, settingsToUpdate: ISettingsUpdate): Promise<UserSettings | null> {
    const { data, error } = await this.client
      .from(SettingsQueriesService.TABLE_NAME)
      .update(settingsToUpdate)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating settings: ${error.message}`);
    }

    if (!data) return null;

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
