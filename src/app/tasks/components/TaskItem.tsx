'use client'

import { updateTaskStatus } from '@/app/actions/tasks'
import { Check, Clock, PlayCircle } from 'lucide-react'
import { useTransition } from 'react'

export default function TaskItem({ task }: { task: any }) {
  const [isPending, startTransition] = useTransition()

  const assignee = task.task_assignees?.[0]?.profiles

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== task.status) {
      startTransition(() => updateTaskStatus(task.id, newStatus))
    }
  }

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      task.status === 'done' ? 'bg-gray-50/80 border-gray-100 opacity-75' : 
      'bg-white border-gray-100 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
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

          {assignee && (
            <div className="mt-4 flex items-center gap-2">
              {assignee.avatar_url ? (
                <img src={assignee.avatar_url} alt={assignee.name} className="w-6 h-6 rounded-full border border-gray-200" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  {assignee.name[0]}
                </div>
              )}
              <span className="text-xs font-semibold text-gray-600">{assignee.name}</span>
            </div>
          )}
        </div>

        {/* Custom Status Switcher */}
        <div className={`flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          <button 
            onClick={() => handleStatusChange('todo')}
            className={`p-2 rounded-lg transition-all ${task.status === 'todo' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400 hover:text-rose-500 hover:bg-white/50'}`}
            title="Da Fare"
          >
            <Clock size={18} />
          </button>
          <button 
            onClick={() => handleStatusChange('in_progress')}
            className={`p-2 rounded-lg transition-all ${task.status === 'in_progress' ? 'bg-white shadow-sm text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-white/50'}`}
            title="In Corso"
          >
            <PlayCircle size={18} />
          </button>
          <button 
            onClick={() => handleStatusChange('done')}
            className={`p-2 rounded-lg transition-all ${task.status === 'done' ? 'bg-white shadow-sm text-emerald-500' : 'text-gray-400 hover:text-emerald-500 hover:bg-white/50'}`}
            title="Completato"
          >
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
