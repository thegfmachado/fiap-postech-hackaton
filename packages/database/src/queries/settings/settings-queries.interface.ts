import { UserSettings } from '@mindease/models';
import { ITaskUpdate } from '../../types.js';

export interface ISettingsQueries {
  getById: (id: string) => Promise<UserSettings>;
  update: (id: string, data: ITaskUpdate) => Promise<UserSettings>;
}
