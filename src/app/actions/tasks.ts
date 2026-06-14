'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createTask(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('due_date') as string
  const assigneeId = formData.get('assignee_id') as string // For v1 we can allow selecting one assignee from a list

  if (!title || title.trim() === '') {
    return { error: 'Il titolo è obbligatorio' }
  }

  const { data: task, error } = await supabase.from('tasks').insert({
    author_id: user.id,
    title,
    description: description || null,
    due_date: dueDate || null,
    status: 'todo'
  }).select('id').single()

  if (error || !task) {
    return { error: 'Errore durante la creazione del task' }
  }

  if (assigneeId) {
    await supabase.from('task_assignees').insert({
      task_id: task.id,
      user_id: assigneeId
    })
  }

  revalidatePath('/tasks')
  return { success: true }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autenticato' }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) return { error: 'Errore aggiornamento stato' }
  
  revalidatePath('/tasks')
}
