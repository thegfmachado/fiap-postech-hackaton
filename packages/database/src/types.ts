import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables, TablesInsert } from "./generated-types.js";

export type TypedSupabaseClient = SupabaseClient<Database>;

type TransformTasks<T> = Omit<T, 'created_at' | 'updated_at'>;


export type ITask = TransformTasks<Tables<'tasks'>>;
export type ITaskInsert = TransformTasks<TablesInsert<'tasks'>>;


export type { Database } from './generated-types.js';
