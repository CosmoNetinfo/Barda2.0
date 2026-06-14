import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, Trash2, Edit3, Pin } from 'lucide-react'
import AdminActions from './components/AdminActions'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Fetch all necessary data
  const [
    { data: members },
    { data: ideas },
    { data: tasks },
    { data: events },
    { data: logs }
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('ideas').select('id, title, status, author_id, profiles(name)').order('created_at', { ascending: false }),
    supabase.from('tasks').select('id, title, status').order('created_at', { ascending: false }),
    supabase.from('events').select('id, title, date, is_pinned').order('date', { ascending: true }),
    supabase.from('activity_log').select('id, action, entity_type, created_at, profiles(name)').order('created_at', { ascending: false }).limit(50)
  ])

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 text-white p-4 rounded-3xl shadow-lg shadow-gray-200">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-barlow uppercase">Admin Panel</h1>
            <p className="text-gray-500 font-medium mt-1">Gestione centrale de Li Bardasci.</p>
          </div>
        </div>
      </header>

      <AdminActions 
        members={members || []} 
        ideas={ideas || []} 
        tasks={tasks || []} 
        events={events || []} 
        logs={logs || []} 
      />
    </div>
  )
}
