import { UserSettings } from '@mindease/models';
import { ISettingsUpdate } from '../../types.js';

export interface ISettingsQueries {
  getById: (id: string) => Promise<UserSettings>;
  upsert: (id: string, data: ISettingsUpdate) => Promise<UserSettings>;
}
