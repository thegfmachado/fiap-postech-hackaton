import type { CookieOptions } from '@supabase/ssr';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';

import type { Database, TypedSupabaseClient } from './types.js';
import { getSupabaseEnv } from './env.js';

interface ICookieStoreLike {
  getAll(): { name: string; value: string; }[] | null;
  set(name: string, value: string, options?: CookieOptions): void;
}

export async function createServerClient(cookieStore: ICookieStoreLike): Promise<TypedSupabaseClient> {
  const { url, anonKey } = getSupabaseEnv()

  return createSupabaseServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
    }
  )
}
