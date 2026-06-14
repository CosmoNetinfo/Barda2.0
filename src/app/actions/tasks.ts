'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createTask(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const groupId = formData.get('groupId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('dueDate') as string

  if (!title) return { error: 'Il titolo è obbligatorio' }

  const { error } = await supabase.from('tasks').insert({
    group_id: groupId,
    author_id: user.id,
    title,
    description: description || null,
    due_date: dueDate || null,
    status: 'todo'
  })

  if (error) return { error: 'Errore creazione task' }

  revalidatePath(`/groups/${groupId}`)
  return { success: true }
}

export async function updateTaskStatus(taskId: string, groupId: string, status: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  revalidatePath(`/groups/${groupId}`)
}

export async function toggleTaskAssignee(taskId: string, groupId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  // Check if already assigned
  const { data: existing } = await supabase
    .from('task_assignees')
    .select('user_id')
    .eq('task_id', taskId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Unassign
    await supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', user.id)
  } else {
    // Assign
    await supabase
      .from('task_assignees')
      .insert({
        task_id: taskId,
        user_id: user.id
      })
  }

  revalidatePath(`/groups/${groupId}`)
}
