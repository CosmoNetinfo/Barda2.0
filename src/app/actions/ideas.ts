'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createIdea(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!title || title.trim() === '') {
    return { error: 'Il titolo è obbligatorio' }
  }

  const { error } = await supabase.from('ideas').insert({
    author_id: user.id,
    title,
    description: description || null,
    category: category || 'articolo',
    status: 'proposta'
  })

  if (error) {
    return { error: 'Errore durante la creazione dell\'idea' }
  }

  revalidatePath('/ideas')
  return { success: true }
}

export async function voteIdea(ideaId: string, voteType: 'up' | 'down') {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  // Controlla se il voto esiste già
  const { data: existingVote } = await supabase
    .from('idea_votes')
    .select('vote')
    .eq('idea_id', ideaId)
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    if (existingVote.vote === voteType) {
      // Rimuove il voto se sta cliccando lo stesso
      await supabase
        .from('idea_votes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
    } else {
      // Aggiorna il voto
      await supabase
        .from('idea_votes')
        .update({ vote: voteType })
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
    }
  } else {
    // Inserisce nuovo voto
    await supabase
      .from('idea_votes')
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        vote: voteType
      })
  }

  revalidatePath('/ideas')
}

export async function updateIdeaStatus(ideaId: string, status: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const { error } = await supabase
    .from('ideas')
    .update({ status })
    .eq('id', ideaId)

  if (error) return { error: 'Errore aggiornamento stato' }
  
  revalidatePath('/ideas')
}
