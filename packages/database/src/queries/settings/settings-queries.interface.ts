import { UserSettings } from '@mindease/models';
import { SettingsRowUpdate } from '../../types.js';

export interface ISettingsQueries {
  getById: (id: string) => Promise<UserSettings>;
  upsert: (id: string, data: SettingsRowUpdate) => Promise<UserSettings>;
}
