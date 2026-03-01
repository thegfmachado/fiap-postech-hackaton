import { createBrowserClient } from '@supabase/ssr'
import type { Database, TypedSupabaseClient } from './types.js'
import { getSupabaseEnv } from './env.js'

export function createClient(): TypedSupabaseClient {
  const { url, anonKey } = getSupabaseEnv()

  return createBrowserClient<Database>(
    url,
    anonKey,
    {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )
}
