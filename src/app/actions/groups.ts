'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createGroup(formData: FormData) {
  const supabase = createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Create group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ name, description })
    .select()
    .single()

  if (groupError) return { error: groupError.message }

  // Add member as admin
  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id, role: 'admin' })

  if (memberError) return { error: memberError.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function joinGroup(formData: FormData) {
  const supabase = createClient()
  const inviteCode = formData.get('inviteCode') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Find group by invite code
  const { data: group, error: findError } = await supabase
    .from('groups')
    .select('id')
    .eq('invite_code', inviteCode)
    .single()

  if (findError) return { error: 'Group not found' }

  // Add user to group
  const { error: joinError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: user.id, role: 'member' })

  if (joinError) return { error: joinError.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
