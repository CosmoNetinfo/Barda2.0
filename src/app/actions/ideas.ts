'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createIdea(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const groupId = formData.get('groupId') as string
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  if (!title || title.trim() === '') {
    return { error: 'Il titolo è obbligatorio' }
  }

  const { error } = await supabase.from('ideas').insert({
    group_id: groupId,
    author_id: user.id,
    title,
    body: body || null,
    status: 'proposta'
  })

  if (error) {
    return { error: 'Errore durante la creazione dell\'idea' }
  }

  revalidatePath(`/groups/${groupId}`)
  return { success: true }
}

export async function voteIdea(ideaId: string, groupId: string, voteType: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from('idea_votes')
    .select('vote')
    .eq('idea_id', ideaId)
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    if (existingVote.vote === voteType) {
      // Remove vote if clicking the same one
      await supabase
        .from('idea_votes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
    } else {
      // Update vote
      await supabase
        .from('idea_votes')
        .update({ vote: voteType })
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
    }
  } else {
    // Insert new vote
    await supabase
      .from('idea_votes')
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        vote: voteType
      })
  }

  revalidatePath(`/groups/${groupId}`)
}

export async function updateIdeaStatus(ideaId: string, groupId: string, status: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const { error } = await supabase
    .from('ideas')
    .update({ status })
    .eq('id', ideaId)

  if (error) return { error: 'Errore aggiornamento stato' }
  
  revalidatePath(`/groups/${groupId}`)
}
