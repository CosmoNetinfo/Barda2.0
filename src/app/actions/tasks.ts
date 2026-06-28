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

    if (assigneeId === 'all') {
      const { data: profiles } = await adminClient.from('profiles').select('id')
      if (profiles && profiles.length > 0) {
        const insertData = profiles.map(p => ({
          task_id: task.id,
          user_id: p.id
        }))
        const { error: assignError } = await adminClient.from('task_assignees').insert(insertData)
        if (assignError) {
          console.error('Error assigning task to all:', assignError)
        }
      }
    } else if (assigneeId) {
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

    if (assigneeId === 'all') {
      const { data: profiles } = await adminClient.from('profiles').select('id')
      if (profiles && profiles.length > 0) {
        const insertData = profiles.map(p => ({
          task_id: taskId,
          user_id: p.id
        }))
        const { error: assignError } = await adminClient.from('task_assignees').insert(insertData)
        if (assignError) {
          console.error('Error assigning task to all:', assignError)
          return { error: `Errore assegnazione task a tutti: ${assignError.message}` }
        }
      }
    } else if (assigneeId) {
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
    
    // Controlliamo se l'utente loggato è tra gli assegnatari di questo task
    const { data: assignee } = await adminClient
      .from('task_assignees')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', user.id)
      .single()

    if (assignee) {
      // Se l'utente loggato è assegnatario, aggiorniamo il suo completamento individuale
      const newCompletedAt = status === 'done' ? new Date().toISOString() : null
      
      const { error: assignError } = await adminClient
        .from('task_assignees')
        .update({ completed_at: newCompletedAt })
        .eq('task_id', taskId)
        .eq('user_id', user.id)

      if (assignError) {
        console.error('Error updating assignee completion:', assignError)
        return { error: 'Errore durante l\'aggiornamento dell\'assegnatario' }
      }

      // Verifica se TUTTI gli assegnatari hanno completato il task
      const { data: allAssignees } = await adminClient
        .from('task_assignees')
        .select('completed_at')
        .eq('task_id', taskId)

      const allCompleted = allAssignees && allAssignees.length > 0 && allAssignees.every(a => !!a.completed_at)
      
      // Lo status globale del task diventa 'done' solo se tutti lo hanno completato,
      // altrimenti impostiamo lo status globale a 'todo' o 'in_progress'
      let globalStatus = 'todo'
      if (allCompleted) {
        globalStatus = 'done'
      } else if (status === 'in_progress') {
        globalStatus = 'in_progress'
      }

      const { error: taskError } = await adminClient
        .from('tasks')
        .update({ status: globalStatus })
        .eq('id', taskId)

      if (taskError) {
        console.error('Error updating task global status:', taskError)
      }

    } else {
      // Se l'utente loggato non è assegnatario (es. autore non assegnatario o admin),
      // aggiorniamo direttamente lo status globale del task
      const { error } = await adminClient
        .from('tasks')
        .update({ status })
        .eq('id', taskId)

      if (error) {
        console.error('Error updating task status:', error)
        return { error: 'Errore aggiornamento stato' }
      }

      // Se impostiamo a 'done', impostiamo completed_at a now() per tutti gli assegnatari.
      // Se impostiamo a 'todo' o 'in_progress', impostiamo completed_at a null per tutti.
      if (status === 'done') {
        await adminClient
          .from('task_assignees')
          .update({ completed_at: new Date().toISOString() })
          .eq('task_id', taskId)
      } else {
        await adminClient
          .from('task_assignees')
          .update({ completed_at: null })
          .eq('task_id', taskId)
      }
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
