import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './components/ProfileForm'
import { User, Lightbulb, CheckSquare, CalendarDays } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch stats
  const [{ count: ideasCount }, { count: rsvpCount }, { data: tasks }] = await Promise.all([
    supabase.from('ideas').select('*', { count: 'exact', head: true }).eq('author_id', user.id),
    supabase.from('event_rsvp').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('task_assignees').select('task_id, tasks!inner(status)').eq('user_id', user.id).eq('tasks.status', 'done')
  ])

  const tasksCount = tasks?.length || 0
  const joinDate = new Date(profile?.created_at || new Date()).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-4 rounded-3xl shadow-lg shadow-red-200">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-barlow uppercase">Il Mio Profilo</h1>
            <p className="text-gray-500 font-medium mt-1">Gestisci le tue informazioni e vedi le statistiche.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold font-barlow uppercase mb-6 text-gray-800">Informazioni Personali</h2>
            <ProfileForm profile={profile} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 font-barlow uppercase text-xl">Statistiche</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-xl"><Lightbulb size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Idee Proposte</p>
                  <p className="text-lg font-black text-gray-900">{ideasCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><CheckSquare size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Task Completati</p>
                  <p className="text-lg font-black text-gray-900">{tasksCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><CalendarDays size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Eventi Partecipati</p>
                  <p className="text-lg font-black text-gray-900">{rsvpCount || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 font-medium">Membro da {joinDate}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 font-barlow uppercase text-xl">Account</h3>
            <div className="space-y-3">
              {(profile?.role === 'admin' || profile?.role === 'founder') && (
                <Link href="/admin" className="w-full flex justify-center bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors">
                  Pannello Admin
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button className="w-full bg-gray-100 hover:bg-red-50 text-red-600 font-bold py-3 rounded-xl transition-colors">
                  Esci dall&apos;account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
