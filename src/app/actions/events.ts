'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createEvent(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const groupId = formData.get('groupId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string

  if (!title || !date) {
    return { error: 'Titolo e Data sono obbligatori' }
  }

  const { error } = await supabase.from('events').insert({
    group_id: groupId,
    author_id: user.id,
    title,
    description: description || null,
    location: location || null,
    date,
    time: time || null
  })

  if (error) {
    return { error: 'Errore durante la creazione dell\'evento' }
  }

  revalidatePath(`/groups/${groupId}`)
  return { success: true }
}

export async function rsvpEvent(eventId: string, groupId: string, status: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  // Check if RSVP exists
  const { data: existingRsvp } = await supabase
    .from('event_rsvp')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single()

  if (existingRsvp) {
    if (existingRsvp.status === status) {
      // Remove RSVP if clicking the same one
      await supabase
        .from('event_rsvp')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)
    } else {
      // Update RSVP
      await supabase
        .from('event_rsvp')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', user.id)
    }
  } else {
    // Insert new RSVP
    await supabase
      .from('event_rsvp')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status
      })
  }

  revalidatePath(`/groups/${groupId}`)
}
