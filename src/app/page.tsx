import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Calendar, CheckSquare, Lightbulb } from 'lucide-react'
import PwaInstallBanner from './components/PwaInstallBanner'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch some summary data for the dashboard
  // (In a real app, these would fetch from the actual tables.
  // We'll mock the UI structure here so it looks complete)
  
  const today = new Date().toISOString()

  const [
    { data: profile },
    { data: nextEvents },
    { data: myTasksRaw },
    { data: latestIdeas }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('events').select('id, title, date, location').gte('date', today).order('date', { ascending: true }).limit(1),
    supabase.from('task_assignees').select('task_id, tasks!inner(id, title, status)').eq('user_id', user.id).neq('tasks.status', 'done'),
    supabase.from('ideas').select('id, title, description, created_at, category, profiles(name), idea_votes(count)').order('created_at', { ascending: false }).limit(3)
  ])

  const userName = profile?.name || user.email?.split('@')[0] || 'Membro'
  const nextEvent = nextEvents?.[0]
  // Extract tasks from join
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myTasks = myTasksRaw?.map((t: any) => t.tasks) || []

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <PwaInstallBanner />

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ciao, {userName}! 👋</h1>
          <p className="text-gray-500 mt-1">Ecco cosa succede nei Bardasci oggi.</p>
        </div>
        <div className="flex items-center gap-4">
          <form action="/auth/signout" method="post">
            <button className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              Esci
            </button>
          </form>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 border border-gray-300">
              {userName[0].toUpperCase()}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Prossimo Evento */}
        <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Calendar size={120} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <Calendar size={20} />
              <h2 className="font-semibold text-sm uppercase tracking-wider">Prossimo Evento</h2>
            </div>
            {nextEvent ? (
              <>
                <h3 className="text-2xl font-bold mb-1">{nextEvent.title}</h3>
                <p className="text-gray-600 mb-6">
                  {new Date(nextEvent.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} 
                  {' • '}
                  {new Date(nextEvent.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  {nextEvent.location && ` • ${nextEvent.location}`}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 relative z-10 mt-auto">
                  <Link href={`/events`} className="flex-1 bg-indigo-600 text-white min-h-[48px] rounded-xl font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center shadow-md">
                    Vedi dettagli
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-400 relative z-10">
                <p className="font-medium">Nessun evento in programma</p>
                <Link href="/events" className="text-indigo-600 text-sm font-bold mt-2 inline-block">Proponine uno</Link>
              </div>
            )}
          </div>
        </section>

        {/* Task Assegnati */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-rose-500 mb-4">
            <CheckSquare size={20} />
            <h2 className="font-semibold text-sm uppercase tracking-wider">I Miei Task</h2>
          </div>
          
          {myTasks.length > 0 ? (
            <ul className="space-y-1 flex-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {myTasks.slice(0, 4).map((task: any) => (
                <li key={task.id} className="flex gap-3 items-center min-h-[44px] hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">
                  <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                  <span className="text-sm font-medium line-clamp-1">{task.title}</span>
                </li>
              ))}
              {myTasks.length > 4 && (
                <li className="text-xs text-gray-400 font-medium pt-2">
                  + altri {myTasks.length - 4} task
                </li>
              )}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-6">
              <CheckSquare size={32} className="mb-2 opacity-20" />
              <p className="text-sm font-medium">Nessun task aperto</p>
            </div>
          )}

          <Link href="/tasks" className="text-sm text-rose-500 font-bold hover:underline mt-4 min-h-[44px] flex items-center">
            Vedi tutti i task →
          </Link>
        </section>
      </div>

      {/* Ultime Idee */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Lightbulb size={20} />
            <h2 className="font-semibold text-sm uppercase tracking-wider">Ultime Idee Proposte</h2>
          </div>
          <Link href="/ideas" className="text-sm text-gray-500 hover:text-black font-medium">Esplora tutte</Link>
        </div>
        
        {latestIdeas && latestIdeas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {latestIdeas.map((idea: any) => (
              <Link href="/ideas" key={idea.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition block">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
                    {idea.category || 'Idea'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(idea.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{idea.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{idea.description}</p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Di {idea.profiles?.name || 'Anonimo'}</span>
                  <div className="flex gap-2 text-amber-600 font-bold">
                    <span>👍 {idea.idea_votes?.[0]?.count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
            <Lightbulb size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Non ci sono ancora idee sulla piattaforma.</p>
            <Link href="/ideas" className="text-amber-600 font-bold mt-2 inline-block">Sii il primo a proporne una!</Link>
          </div>
        )}
      </section>
    </div>
  )
}
