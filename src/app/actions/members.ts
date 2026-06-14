'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateMemberRole(userId: string, newRole: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorizzato')

  // Check se chi chiama è admin
  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin' && callerProfile?.role !== 'founder') {
    throw new Error('Solo gli admin possono modificare i ruoli')
  }

  // Controlla se il target è founder o se il nuovo ruolo è founder
  const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', userId).single()

  if (targetProfile?.role === 'founder' && callerProfile?.role !== 'founder') {
    throw new Error('Un admin non può modificare il ruolo del Founder.')
  }

  if (newRole === 'founder' && callerProfile?.role !== 'founder') {
    throw new Error('Solo un Founder può nominare un altro Founder.')
  }

  // Esegui l'update
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    throw new Error('Errore durante l\'aggiornamento del ruolo')
  }

  revalidatePath('/members')
}
