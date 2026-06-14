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

  // Fetch tasks with assignees
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      task_assignees (
        profiles (id, name, avatar_url)
      )
    `)
    .order('created_at', { ascending: false })

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Da Fare Column */}
          <div className="space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Da Fare ({todoTasks.length})
            </h2>
            <div className="space-y-3">
              {todoTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* In Corso Column */}
          <div className="space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              In Lavorazione ({inProgressTasks.length})
            </h2>
            <div className="space-y-3">
              {inProgressTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Completati Column */}
          <div className="space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Fatto ({doneTasks.length})
            </h2>
            <div className="space-y-3">
              {doneTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
