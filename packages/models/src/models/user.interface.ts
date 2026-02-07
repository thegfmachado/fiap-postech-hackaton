import { ISettings } from "./settings.interface.js";

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  settings: ISettings;
  createdAt: string;
  updatedAt: string;
}