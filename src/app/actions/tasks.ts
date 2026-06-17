'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function createTask(formData: FormData) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non autenticato' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('due_date') as string
    const assigneeId = formData.get('assignee_id') as string

    if (!title || title.trim() === '') {
      return { error: 'Il titolo è obbligatorio' }
    }

    const adminClient = createAdminClient()

    const { data: task, error } = await adminClient.from('tasks').insert({
      author_id: user.id,
      title,
      description: description || null,
      due_date: dueDate || null,
      status: 'todo'
    }).select('id').single()

    if (error || !task) {
      return { error: `Errore durante la creazione del task: ${error?.message || 'Risposta vuota'}` }
    }

    if (assigneeId) {
      const { error: assignError } = await adminClient.from('task_assignees').insert({
        task_id: task.id,
        user_id: assigneeId
      })
      if (assignError) {
        console.error('Error assigning task:', assignError)
      }
    }

    revalidatePath('/tasks')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('createTask crash:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return { error: `Errore imprevisto: ${errMsg}` }
  }
}

export async function updateTask(taskId: string, formData: FormData) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non autenticato' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('due_date') as string
    const assigneeId = formData.get('assignee_id') as string

    if (!title || title.trim() === '') {
      return { error: 'Il titolo è obbligatorio' }
    }

    const adminClient = createAdminClient()

    // 1. Update task details
    const { error: taskError } = await adminClient
      .from('tasks')
      .update({
        title,
        description: description || null,
        due_date: dueDate || null
      })
      .eq('id', taskId)

    if (taskError) {
      console.error('Error updating task:', taskError)
      return { error: `Errore aggiornamento task: ${taskError.message}` }
    }

    // 2. Update assignee (delete and re-insert)
    await adminClient
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId)

    if (assigneeId) {
      const { error: assignError } = await adminClient
        .from('task_assignees')
        .insert({
          task_id: taskId,
          user_id: assigneeId
        })
      if (assignError) {
        console.error('Error assigning task:', assignError)
        return { error: `Errore assegnazione task: ${assignError.message}` }
      }
    }

    revalidatePath('/tasks')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('updateTask crash:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return { error: `Errore imprevisto: ${errMsg}` }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non autenticato' }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('tasks')
      .update({ status })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task status:', error)
      return { error: 'Errore aggiornamento stato' }
    }
    
    revalidatePath('/tasks')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('updateTaskStatus crash:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return { error: `Errore imprevisto: ${errMsg}` }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non autenticato' }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
      return { error: 'Errore durante l\'eliminazione del task' }
    }

    revalidatePath('/tasks')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    console.error('deleteTask crash:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    return { error: `Errore imprevisto: ${errMsg}` }
  }
}
