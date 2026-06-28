import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CheckSquare } from 'lucide-react'
import TaskForm from './components/TaskForm'
import TaskItem from './components/TaskItem'

export default async function TasksPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all profiles for assignee dropdown
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .order('name')

  // Fetch tasks
  const { data: tasksRaw, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch task assignees
  const { data: assigneesRaw } = await supabase
    .from('task_assignees')
    .select('*')

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Map assignees to tasks to retain compatibility with TaskItem.tsx
  const tasks = tasksRaw?.map(task => {
    const taskAssigneesRaw = assigneesRaw?.filter(a => a.task_id === task.id) || []
    
    // Controlliamo se l'utente loggato ha completato questo task personalmente
    const myAssignment = taskAssigneesRaw.find(a => a.user_id === user.id)
    const isCompletedByMe = myAssignment ? !!myAssignment.completed_at : false
    
    // Lo status effettivo per l'utente loggato:
    // Se lo ha completato lui, per lui è 'done' (indipendentemente dallo status globale del task).
    // Se non lo ha completato ma lo status globale del task è 'done', lo mostriamo come 'todo' (aperto) 
    // perché lui personalmente non lo ha ancora marcato come completato!
    const effectiveStatus = myAssignment
      ? (isCompletedByMe ? 'done' : (task.status === 'done' ? 'todo' : task.status))
      : task.status

    const taskAssignees = taskAssigneesRaw
      .map(a => ({
        profiles: profileMap.get(a.user_id) || null,
        completed_at: a.completed_at
      }))
      .filter(a => a.profiles !== null) || []

    return {
      ...task,
      status: effectiveStatus,
      task_assignees: taskAssignees
    }
  }) || []

  // Debug: log if tasks query fails
  if (tasksError) {
    console.error('Tasks fetch error:', tasksError.message)
  }

  const todoTasks = tasks?.filter(t => t.status === 'todo') || []
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || []
  const doneTasks = tasks?.filter(t => t.status === 'done') || []

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-rose-400 to-rose-600 text-white p-4 rounded-3xl shadow-lg shadow-rose-200">
            <CheckSquare size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Task Board</h1>
            <p className="text-gray-500 font-medium mt-1">Cose da fare e chi deve farle.</p>
          </div>
        </div>
        
        <div className="w-full md:w-80">
          <TaskForm profiles={profiles || []} />
        </div>
      </header>

      {tasks?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
          <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Tutto pulito!</h3>
          <p className="mt-1">Non ci sono task da completare. Ottimo lavoro.</p>
        </div>
      ) : (
        <>
        <div className="space-y-8">
          {/* Da Fare */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-rose-600 border-b pb-2 border-rose-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
              Da Fare ({todoTasks.length})
            </h2>
            {todoTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic pl-1">Nessun task in questa lista.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {todoTasks.map(task => (
                  <TaskItem key={task.id} task={task} profiles={profiles || []} />
                ))}
              </div>
            )}
          </div>

          {/* In Lavorazione */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-500 border-b pb-2 border-amber-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              In Lavorazione ({inProgressTasks.length})
            </h2>
            {inProgressTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic pl-1">Nessun task in questa lista.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {inProgressTasks.map(task => (
                  <TaskItem key={task.id} task={task} profiles={profiles || []} />
                ))}
              </div>
            )}
          </div>

          {/* Fatto */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-600 border-b pb-2 border-emerald-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              Completati ({doneTasks.length})
            </h2>
            {doneTasks.length === 0 ? (
              <p className="text-sm text-gray-400 italic pl-1">Nessun task completato.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {doneTasks.map(task => (
                  <TaskItem key={task.id} task={task} profiles={profiles || []} />
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}
