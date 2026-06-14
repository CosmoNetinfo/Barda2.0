'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(name: string, bio: string, avatarUrl: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Non autorizzato')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      name, 
      bio: bio.substring(0, 160), 
      avatar_url: avatarUrl 
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Impossibile aggiornare il profilo')
  }

  // Log the activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: 'ha aggiornato il profilo',
    entity_type: 'member',
    entity_id: user.id
  })

  revalidatePath('/profile')
}
