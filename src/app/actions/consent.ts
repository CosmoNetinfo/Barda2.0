'use server'
import { createClient } from '@/utils/supabase/server'

export async function saveConsent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const { error } = await supabase
    .from('profiles')
    .update({ consent_accepted_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}
