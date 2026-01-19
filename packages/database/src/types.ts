import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables, TablesInsert, TablesUpdate } from "./generated-types.js";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type { Database } from './generated-types.js';
