import { UserSettings } from '@mindease/models';
import { TaskRowUpdate } from '../../types.js';

export interface ISettingsQueries {
  getById: (id: string) => Promise<UserSettings>;
  update: (id: string, data: TaskRowUpdate) => Promise<UserSettings>;
}
