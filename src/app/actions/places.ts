'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createPlace(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const address = formData.get('address') as string
  const maps_url = formData.get('maps_url') as string

  if (!name || name.trim() === '') {
    return { error: 'Il nome è obbligatorio' }
  }

  const { error } = await supabase.from('places').insert({
    author_id: user.id,
    name,
    category: category || null,
    address: address || null,
    maps_url: maps_url || null,
    status: 'da_provare'
  })

  if (error) {
    return { error: 'Errore durante la creazione del luogo' }
  }

  revalidatePath('/places')
  return { success: true }
}

export async function updatePlaceStatus(placeId: string, status: string, rating?: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const updateData: Record<string, string | number> = { status }
  if (status === 'visitato') {
    updateData.visited_at = new Date().toISOString()
  }
  if (rating !== undefined) {
    updateData.rating = rating
  }

  const { error } = await supabase
    .from('places')
    .update(updateData)
    .eq('id', placeId)

  if (error) return { error: 'Errore aggiornamento luogo' }
  
  revalidatePath('/places')
}
