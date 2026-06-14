'use client'

import { useState } from 'react'
import { createTask, updateTaskStatus, toggleTaskAssignee } from '../../actions/tasks'

type Task = {
  id: string
  title: string
  description: string
  due_date: string
  status: string
  author: { email: string }
  assignees: { user: { email: string }, user_id: string }[]
}

export default function TaskActions({ groupId, tasks, currentUserId }: { groupId: string, tasks: Task[], currentUserId: string }) {
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('groupId', groupId)
    const res = await createTask(formData)
    if (res?.error) setError(res.error)
    else setIsCreating(false)
    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  }

  const statusLabels: Record<string, string> = {
    todo: 'Da fare',
    in_progress: 'In corso',
    done: 'Fatto',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compiti e Task</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Nuovo Task
        </button>
      </div>

      {isCreating && (
        <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Crea un Task</h3>
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium">Titolo Task</label>
            <input id="title" name="title" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Comprare la carne per la grigliata" />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">Scadenza (Opzionale)</label>
            <input type="date" id="dueDate" name="dueDate" className="w-full rounded-md border p-2 text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-1 block text-sm font-medium">Descrizione (Opzionale)</label>
            <textarea id="description" name="description" rows={2} className="w-full rounded-md border p-2 text-sm" />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
            <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Crea Task</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map((task) => {
          const amIAssigned = task.assignees?.some(a => a.user_id === currentUserId)

          return (
            <div key={task.id} className="rounded-lg border bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-bold ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</h3>
                  <select 
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, groupId, e.target.value)}
                    className={`rounded-full px-2 py-1 text-xs font-semibold appearance-none border-none cursor-pointer ${statusColors[task.status]}`}
                  >
                    <option value="todo">Da fare</option>
                    <option value="in_progress">In corso</option>
                    <option value="done">Fatto</option>
                  </select>
                </div>
                
                {task.due_date && (
                  <p className="text-xs font-medium text-red-600 mb-2">
                    Scadenza: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                )}
                
                {task.description && <p className="text-sm text-gray-600 mb-4">{task.description}</p>}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {task.assignees?.length > 0 ? (
                      task.assignees.map((a, i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-white" title={a.user?.email || 'User'}>
                          {a.user?.email ? a.user.email[0].toUpperCase() : 'U'}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Nessuno assegnato</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => toggleTaskAssignee(task.id, groupId)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${amIAssigned ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-white text-black border-gray-200 hover:bg-gray-50'}`}
                  >
                    {amIAssigned ? 'Abbandona' : 'Prendi in carico'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {tasks.length === 0 && !isCreating && (
          <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-gray-500">
            Nessun task da fare! Tutti al mare 🏖️
          </div>
        )}
      </div>
    </div>
  )
}
