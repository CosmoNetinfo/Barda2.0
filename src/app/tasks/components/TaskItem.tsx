'use client'

import { updateTaskStatus, deleteTask, updateTask } from '@/app/actions/tasks'
import { Check, Clock, PlayCircle, Trash2, Pencil, Loader2, Calendar } from 'lucide-react'
import { useTransition, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskItem({ task, profiles = [] }: { task: any, profiles?: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  const assignee = task.task_assignees?.[0]?.profiles

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== task.status) {
      startTransition(async () => { 
        const res = await updateTaskStatus(task.id, newStatus) 
        if (res && res.error) {
          alert(res.error)
        }
      })
    }
  }

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
      startTransition(async () => {
        const res = await deleteTask(task.id)
        if (res && res.error) {
          alert(res.error)
        }
      })
    }
  }

  async function handleEditSubmit(formData: FormData) {
    setEditLoading(true)
    setEditError('')
    const result = await updateTask(task.id, formData)
    setEditLoading(false)
    if (result?.error) {
      setEditError(result.error)
    } else {
      setIsEditing(false)
    }
  }

  return (
    <>
      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
        task.status === 'done' ? 'bg-gray-50/80 border-gray-100 opacity-75' : 
        'bg-white border-gray-100 shadow-sm hover:shadow-md'
      }`}>
        <div className="flex flex-col gap-3">
          {/* Top Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                task.status === 'todo' ? 'bg-rose-50 text-rose-600' :
                task.status === 'in_progress' ? 'bg-amber-50 text-amber-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {task.status === 'todo' ? 'Da Fare' : task.status === 'in_progress' ? 'In Corso' : 'Completato'}
              </span>
              {task.due_date && (
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(task.due_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
            
            <h4 className={`text-lg font-bold transition-all ${task.status === 'done' ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className={`text-sm mt-1 line-clamp-2 ${task.status === 'done' ? 'text-gray-400' : 'text-gray-500'}`}>
                {task.description}
              </p>
            )}
          </div>

          {/* Bottom Actions & Assignee */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100/80 mt-1">
            {assignee ? (
              <div className="flex items-center gap-2 min-w-0">
                {assignee.avatar_url ? (
                  <img src={assignee.avatar_url} alt={assignee.name} className="w-6 h-6 rounded-full border border-gray-200 object-cover shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {assignee.name[0]}
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-600 truncate">{assignee.name}</span>
              </div>
            ) : (
              <div />
            )}

            {/* Custom Status Switcher & Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className={`flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                <button 
                  onClick={() => handleStatusChange('todo')}
                  className={`p-1.5 rounded-lg transition-all ${task.status === 'todo' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400 hover:text-rose-500 hover:bg-white/50'}`}
                  title="Da Fare"
                >
                  <Clock size={16} />
                </button>
                <button 
                  onClick={() => handleStatusChange('in_progress')}
                  className={`p-1.5 rounded-lg transition-all ${task.status === 'in_progress' ? 'bg-white shadow-sm text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-white/50'}`}
                  title="In Corso"
                >
                  <PlayCircle size={16} />
                </button>
                <button 
                  onClick={() => handleStatusChange('done')}
                  className={`p-1.5 rounded-lg transition-all ${task.status === 'done' ? 'bg-white shadow-sm text-emerald-500' : 'text-gray-400 hover:text-emerald-500 hover:bg-white/50'}`}
                  title="Completato"
                >
                  <Check size={16} />
                </button>
              </div>
              
              <button 
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-gray-200/60 min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50"
                title="Modifica Task"
              >
                <Pencil size={16} />
              </button>

              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-200/60 min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50"
                title="Elimina Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          />

          {/* Form Container */}
          <div className="relative w-full md:w-[450px] bg-white md:rounded-3xl rounded-t-3xl shadow-2xl border-t md:border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg tracking-wide">Modifica Task</h3>
              <button type="button" onClick={() => setIsEditing(false)} className="text-white/80 hover:text-white text-sm font-semibold transition-colors">Annulla</button>
            </div>
            
            <form action={handleEditSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cosa c&apos;è da fare?</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={task.title}
                  required
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder-gray-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assegna a</label>
                  <select 
                    name="assignee_id"
                    defaultValue={assignee?.id || ''}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all font-medium"
                  >
                    <option value="">Lascia non assegnato</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scadenza</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="due_date"
                      defaultValue={task.due_date || ''}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                    <Calendar size={18} className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dettagli</label>
                <textarea 
                  name="description" 
                  rows={3}
                  defaultValue={task.description || ''}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder-gray-400"
                />
              </div>

              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-medium">
                  ⚠️ {editError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={editLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold min-h-[44px] py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {editLoading ? <Loader2 className="animate-spin" size={20} /> : 'Salva Modifiche'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
