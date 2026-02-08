import { Settings } from "./settings.interface.js";

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  settings: Settings;
  createdAt: string;
  updatedAt: string;
}