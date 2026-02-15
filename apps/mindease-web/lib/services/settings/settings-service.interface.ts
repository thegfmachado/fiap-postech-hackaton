import { ISettingsUpdate } from "@mindease/database/types";
import { Settings } from "@mindease/models";

export interface ISettingsService {
  getById: (id: string) => Promise<Settings>;
  update: (id: string, data: Settings) => Promise<Settings>;
}
