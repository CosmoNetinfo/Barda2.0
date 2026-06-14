'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkFounder(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'founder') {
    throw new Error('Forbidden')
  }
  return { user, profile }
}

export async function forceRevalidate() {
  const supabase = createClient()
  await checkFounder(supabase)
  
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function clearActivityLog() {
  const supabase = createClient()
  await checkFounder(supabase)

  const { error } = await supabase.from('activity_log').delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all
  if (error) throw new Error(error.message)

  revalidatePath('/admin/debug')
  return { success: true }
}
