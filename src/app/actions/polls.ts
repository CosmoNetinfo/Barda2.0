'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createPoll(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const groupId = formData.get('groupId') as string
  const question = formData.get('question') as string
  const type = formData.get('type') as string // 'single' o 'multi'
  const optionsString = formData.get('options') as string

  if (!question || !optionsString) return { error: 'Domanda e opzioni sono obbligatorie' }

  const options = optionsString.split(',').map(o => o.trim()).filter(o => o.length > 0)
  if (options.length < 2) return { error: 'Inserisci almeno 2 opzioni separate da virgola' }

  // Create Poll
  const { data: poll, error: pollError } = await supabase.from('polls').insert({
    group_id: groupId,
    author_id: user.id,
    question,
    type: type || 'single',
  }).select().single()

  if (pollError || !poll) return { error: 'Errore creazione sondaggio' }

  // Create Options
  const pollOptions = options.map(label => ({
    poll_id: poll.id,
    label
  }))

  const { error: optionsError } = await supabase.from('poll_options').insert(pollOptions)
  
  if (optionsError) return { error: 'Errore creazione opzioni del sondaggio' }

  revalidatePath(`/groups/${groupId}`)
  return { success: true }
}

export async function votePoll(pollId: string, optionId: string, groupId: string, isMulti: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  if (!isMulti) {
    // Single choice: delete previous votes of this user for this poll
    // First, find all options for this poll
    const { data: pollOptions } = await supabase
      .from('poll_options')
      .select('id')
      .eq('poll_id', pollId)

    if (pollOptions) {
      const optionIds = pollOptions.map(o => o.id)
      await supabase
        .from('poll_votes')
        .delete()
        .in('option_id', optionIds)
        .eq('user_id', user.id)
    }
  }

  // Check if vote already exists for this specific option
  const { data: existingVote } = await supabase
    .from('poll_votes')
    .select('*')
    .eq('option_id', optionId)
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    // Toggle vote (remove if already voted this option)
    await supabase
      .from('poll_votes')
      .delete()
      .eq('option_id', optionId)
      .eq('user_id', user.id)
  } else {
    // Insert new vote
    await supabase
      .from('poll_votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id
      })
  }

  revalidatePath(`/groups/${groupId}`)
}
