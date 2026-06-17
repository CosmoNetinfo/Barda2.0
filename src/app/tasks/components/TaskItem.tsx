'use client'

import { updateTaskStatus, deleteTask } from '@/app/actions/tasks'
import { Check, Clock, PlayCircle, Trash2 } from 'lucide-react'
import { useTransition } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskItem({ task }: { task: any }) {
  const [isPending, startTransition] = useTransition()

  const assignee = task.task_assignees?.[0]?.profiles

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== task.status) {
      startTransition(() => { updateTaskStatus(task.id, newStatus) })
    }
  }

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questo task?')) {
      startTransition(async () => {
        await deleteTask(task.id)
      })
    }
  }

  return (
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

          {/* Custom Status Switcher & Delete Button */}
          <div className="flex items-center gap-2 shrink-0">
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
  )
}
