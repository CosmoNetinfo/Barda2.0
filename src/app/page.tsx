import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Calendar, CheckSquare, Lightbulb } from 'lucide-react'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch some summary data for the dashboard
  // (In a real app, these would fetch from the actual tables.
  // We'll mock the UI structure here so it looks complete)
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const userName = profile?.name || user.email?.split('@')[0] || 'Membro'

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
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
            <h3 className="text-2xl font-bold mb-1">Riunione Redazione</h3>
            <p className="text-gray-600 mb-6">Sabato 20 Giugno • 18:30 • Sede</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <button className="flex-1 bg-indigo-600 text-white min-h-[48px] rounded-xl font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center shadow-md">Ci sarò</button>
            <button className="flex-1 bg-gray-100 text-gray-700 min-h-[48px] rounded-xl font-bold hover:bg-gray-200 transition-colors flex justify-center items-center">Non posso</button>
          </div>
        </section>

        {/* Task Assegnati */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-rose-500 mb-4">
            <CheckSquare size={20} />
            <h2 className="font-semibold text-sm uppercase tracking-wider">I Miei Task</h2>
          </div>
          <ul className="space-y-1 flex-1">
            <li className="flex gap-3 items-center min-h-[44px] hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
              <span className="text-sm font-medium">Scrivere bozza articolo su Spoleto</span>
            </li>
            <li className="flex gap-3 items-center min-h-[44px] hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500" />
              <span className="text-sm font-medium">Montaggio video intervista</span>
            </li>
          </ul>
          <Link href="/tasks" className="text-sm text-rose-500 font-bold hover:underline mt-4 min-h-[44px] flex items-center">Vedi tutti i task →</Link>
        </section>
      </div>

      {/* Ultime Idee */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Lightbulb size={20} />
            <h2 className="font-semibold">Ultime Idee Proposte</h2>
          </div>
          <Link href="/ideas" className="text-sm text-gray-500 hover:text-black">Esplora</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mock Idea 1 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Articolo</span>
              <span className="text-xs text-gray-400">Oggi</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">I buchi di Spoleto</h3>
            <p className="text-sm text-gray-500 line-clamp-2">Un pezzo satirico sulle buche nelle strade dopo la pioggia...</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-400">Di Dany</span>
              <div className="flex gap-2 text-gray-500">
                <span>👍 4</span>
              </div>
            </div>
          </div>
          {/* Mock Idea 2 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-2 py-1 rounded-full">Video</span>
              <span className="text-xs text-gray-400">Ieri</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Vox populi in piazza</h3>
            <p className="text-sm text-gray-500 line-clamp-2">Andiamo in piazza Garibaldi a chiedere cosa pensano del nuovo ponte.</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-400">Di Marco</span>
              <div className="flex gap-2 text-gray-500">
                <span>👍 8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
