import { UserSettings } from "@mindease/models";

export interface ISettingsService {
  getById: (id: string) => Promise<UserSettings>;
  update: (id: string, data: UserSettings) => Promise<UserSettings>;
}
