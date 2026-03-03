import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables, TablesInsert, TablesUpdate } from "./generated-types.js";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type ITask = Tables<'tasks'>;
export type ITaskInsert = TablesInsert<'tasks'>;
export type ITaskUpdate = TablesUpdate<'tasks'>;

export type ISettings = Tables<'settings'>;
export type ISettingsInsert = TablesInsert<'settings'>;
export type ISettingsUpdate = TablesUpdate<'settings'>;

export type IChecklists = Tables<'checklists'>;
export type IChecklistsInsert = TablesInsert<'checklists'>;
export type IChecklistsUpdate = TablesUpdate<'checklists'>;

export type { Database } from './generated-types.js';
