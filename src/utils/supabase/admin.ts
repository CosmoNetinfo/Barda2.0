import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the SERVICE_ROLE_KEY.
 * This bypasses RLS entirely — use only in server actions
 * where the caller has already been verified as admin/founder.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY nelle variabili d\'ambiente'
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
