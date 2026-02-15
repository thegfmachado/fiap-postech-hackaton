import { Settings } from '@mindease/models';
import { ITaskUpdate } from '../../types.js';

export interface ISettingsQueries {
  getById: (id: string) => Promise<Settings>;
  update: (id: string, data: ITaskUpdate) => Promise<Settings>;
}
