'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createPoll(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const question = formData.get('question') as string
  const type = formData.get('type') as string
  const expiresAt = formData.get('expires_at') as string
  const optionsRaw = formData.get('options') as string

  if (!question || question.trim() === '') {
    return { error: 'La domanda è obbligatoria' }
  }

  let options: string[] = []
  try {
    options = JSON.parse(optionsRaw)
  } catch {
    return { error: 'Opzioni non valide' }
  }

  if (options.length < 2) {
    return { error: 'Inserisci almeno 2 opzioni' }
  }

  // Creazione poll
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      author_id: user.id,
      question,
      type: type || 'single',
      expires_at: expiresAt || null
    })
    .select('id')
    .single()

  if (pollError || !poll) {
    return { error: 'Errore durante la creazione del sondaggio' }
  }

  // Creazione opzioni
  const optionsToInsert = options.map(opt => ({
    poll_id: poll.id,
    label: opt
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert)

  if (optionsError) {
    return { error: 'Errore inserimento opzioni' }
  }

  revalidatePath('/polls')
  return { success: true }
}

export async function votePoll(pollId: string, optionId: string, isMulti: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  // Se è a risposta singola, rimuovi i vecchi voti di questo utente per questo sondaggio
  if (!isMulti) {
    // Prima troviamo le opzioni del sondaggio
    const { data: options } = await supabase
      .from('poll_options')
      .select('id')
      .eq('poll_id', pollId)

    if (options) {
      const optionIds = options.map(o => o.id)
      await supabase
        .from('poll_votes')
        .delete()
        .eq('user_id', user.id)
        .in('option_id', optionIds)
    }
  } else {
    // Se è multi, controlla se ha già votato questa opzione (per fare toggle)
    const { data: existingVote } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('option_id', optionId)
      .eq('user_id', user.id)
      .single()

    if (existingVote) {
      await supabase
        .from('poll_votes')
        .delete()
        .eq('option_id', optionId)
        .eq('user_id', user.id)
      
      revalidatePath('/polls')
      return { success: true }
    }
  }

  // Inserisci nuovo voto
  const { error } = await supabase
    .from('poll_votes')
    .insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    })

  if (error) return { error: 'Errore durante il voto' }

  revalidatePath('/polls')
  return { success: true }
}
