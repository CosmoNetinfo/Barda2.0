'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createPlace(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const groupId = formData.get('groupId') as string
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const address = formData.get('address') as string
  const mapsUrl = formData.get('mapsUrl') as string

  if (!name) return { error: 'Il nome è obbligatorio' }

  const { error } = await supabase.from('places').insert({
    group_id: groupId,
    author_id: user.id,
    name,
    category: category || null,
    address: address || null,
    maps_url: mapsUrl || null,
    status: 'da_provare'
  })

  if (error) return { error: 'Errore creazione luogo' }

  revalidatePath(`/groups/${groupId}`)
  return { success: true }
}

export async function updatePlaceStatus(placeId: string, groupId: string, status: string, rating?: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const updateData: any = { status }
  if (status === 'visitato') {
    updateData.visited_at = new Date().toISOString()
  }
  if (rating !== undefined) {
    updateData.rating = rating
  }

  await supabase
    .from('places')
    .update(updateData)
    .eq('id', placeId)

  revalidatePath(`/groups/${groupId}`)
}
