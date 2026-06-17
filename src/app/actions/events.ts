'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createEvent(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string

  // Costruire date e time dai campi separati (fix iOS Safari)
  const day = formData.get('day') as string
  const month = formData.get('month') as string
  const year = formData.get('year') as string
  const hour = formData.get('hour') as string
  const minute = formData.get('minute') as string

  // Formato data per Supabase: YYYY-MM-DD
  const date = year && month && day
    ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    : null

  // Formato ora: HH:MM
  const time = hour && minute ? `${hour}:${minute}` : null

  if (!title || !date) {
    return { error: 'Titolo e Data sono obbligatori' }
  }

  const { data: event, error } = await supabase.from('events').insert({
    author_id: user.id,
    title,
    description: description || null,
    location: location || null,
    date,
    time: time || null
  }).select().single()

  if (error || !event) {
    return { error: `Errore durante la creazione dell'evento: ${error?.message || 'Risposta vuota'}` }
  }

  revalidatePath('/events')
  return { success: true }
}

export async function rsvpEvent(eventId: string, status: 'yes' | 'no' | 'maybe') {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non autenticato' }

    // Controlla rsvp esistente - usando limit(1) per evitare l'errore single()
    const { data: existingList, error: checkError } = await supabase
      .from('event_rsvp')
      .select('status')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .limit(1)

    if (checkError) {
      console.error('Error checking rsvp:', checkError)
      return { error: `Errore durante il controllo: ${checkError.message}` }
    }

    const existing = existingList && existingList.length > 0 ? existingList[0] : null

    if (existing) {
      const { error: updateError } = await supabase
        .from('event_rsvp')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating rsvp:', updateError)
        return { error: `Errore durante l'aggiornamento: ${updateError.message}` }
      }
    } else {
      const { error: insertError } = await supabase
        .from('event_rsvp')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status
        })

      if (insertError) {
        console.error('Error inserting rsvp:', insertError)
        return { error: `Errore durante l'iscrizione: ${insertError.message}` }
      }
    }

    revalidatePath('/events')
    revalidatePath('/') // Aggiorna anche la dashboard
    return { success: true }
  } catch (err) {
    console.error('rsvpEvent crash:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return { error: `Errore imprevisto: ${errMsg}` }
  }
}
