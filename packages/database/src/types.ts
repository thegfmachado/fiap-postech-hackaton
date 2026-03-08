import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables, TablesInsert, TablesUpdate } from "./generated-types.js";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type TaskRow = Tables<'tasks'>;
export type TaskRowInsert = TablesInsert<'tasks'>;
export type TaskRowUpdate = TablesUpdate<'tasks'>;
export type TaskRowWithChecklists = TaskRow & { checklists?: Omit<ChecklistRow, 'created_at' | 'user_id'>[] };

export type SettingsRow = Tables<'settings'>;
export type SettingsRowInsert = TablesInsert<'settings'>;
export type SettingsRowUpdate = TablesUpdate<'settings'>;

export type ChecklistRow = Tables<'checklists'>;
export type ChecklistRowInsert = TablesInsert<'checklists'>;
export type ChecklistRowUpdate = TablesUpdate<'checklists'>;

export type { Database } from './generated-types.js';
