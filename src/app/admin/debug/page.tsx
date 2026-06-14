import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Bug, Database, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import AutoRefresh from './components/AutoRefresh'
import DebugActions from './components/DebugActions'

export default async function DebugPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  if (profile?.role !== 'founder') {
    redirect('/')
  }

  // Check DB Connection
  let dbStatus = 'Connesso'
  let isDbConnected = true
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1)
    if (error) throw error
  } catch (err: any) {
    dbStatus = err.message
    isDbConnected = false
  }

  // Get table stats
  const tables = [
    'profiles', 'events', 'event_rsvp', 'ideas', 'idea_votes', 
    'tasks', 'task_assignees', 'polls', 'poll_options', 'poll_votes', 
    'places', 'activity_log'
  ]

  const tableStats = await Promise.all(
    tables.map(async (table) => {
      try {
        const { count, data } = await supabase
          .from(table)
          .select('created_at', { count: 'exact', head: false })
          .order('created_at', { ascending: false })
          .limit(1)
        
        return { 
          name: table, 
          count: count || 0, 
          latest: data?.[0]?.created_at || null,
          error: null
        }
      } catch (err: any) {
        return { name: table, count: 0, latest: null, error: err.message }
      }
    })
  )

  const emptyTables = tableStats.filter(t => t.count === 0 && !t.error)

  // Verify events.is_pinned
  let isPinnedExists = true
  try {
    const { error } = await supabase.from('events').select('is_pinned').limit(1)
    if (error) isPinnedExists = false
  } catch {
    isPinnedExists = false
  }

  // Get Active Members with auth.users if possible
  let membersData: any[] = []
  try {
    const { data: usersData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError || !usersData?.users) {
      // Fallback
      const { data: profilesData } = await supabase.from('profiles').select('*')
      membersData = (profilesData || []).map(p => ({
        id: p.id,
        email: 'N/A (No Admin API)',
        name: p.name,
        role: p.role,
        last_sign_in_at: p.created_at // Fallback to created_at
      }))
    } else {
      const { data: profilesData } = await supabase.from('profiles').select('*')
      membersData = usersData.users.map(u => {
        const p = profilesData?.find(profile => profile.id === u.id)
        return {
          id: u.id,
          email: u.email,
          name: p?.name || 'Senza Profilo',
          role: p?.role || 'user',
          last_sign_in_at: u.last_sign_in_at
        }
      })
    }
  } catch (err) {
    const { data: profilesData } = await supabase.from('profiles').select('*')
    membersData = (profilesData || []).map(p => ({
      id: p.id,
      email: 'N/A',
      name: p.name,
      role: p.role,
      last_sign_in_at: p.created_at
    }))
  }

  // Get Activity Log
  const { data: activityLog } = await supabase
    .from('activity_log')
    .select('id, action, entity_type, created_at, profiles(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-[#1a1a2a] text-gray-200 pb-24 p-4 md:p-8">
      <AutoRefresh intervalMs={30000} />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white p-4 rounded-3xl shadow-lg shadow-red-900/50">
            <Bug size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-red-500 font-barlow uppercase">🐛 DEBUG PANEL</h1>
            <p className="text-gray-400 font-medium mt-1">Super Pannello per diagnostica e manutenzione.</p>
          </div>
        </div>
        <DebugActions />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* STATO SISTEMA */}
        <section className="bg-[#242438] p-6 rounded-3xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6 uppercase flex items-center gap-2">
            <Database className="text-blue-400" /> Stato Sistema
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-[#1a1a2a] rounded-xl border border-gray-800">
              <span className="text-gray-400">Database Supabase</span>
              {isDbConnected ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle size={16} /> Online</span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 font-bold"><XCircle size={16} /> Errore: {dbStatus}</span>
              )}
            </div>
            <div className="flex justify-between items-center p-3 bg-[#1a1a2a] rounded-xl border border-gray-800">
              <span className="text-gray-400">Ambiente</span>
              <span className="text-indigo-400 font-bold">{process.env.NODE_ENV}</span>
            </div>
            <div className="p-4 bg-[#1a1a2a] rounded-xl border border-gray-800">
              <h3 className="text-gray-400 mb-2 font-semibold">Utente Corrente (Founder)</h3>
              <ul className="space-y-1 text-gray-300">
                <li><span className="text-gray-500">Nome:</span> {profile?.name}</li>
                <li><span className="text-gray-500">Email:</span> {user.email}</li>
                <li><span className="text-gray-500">ID:</span> <code className="text-xs bg-black/30 p-1 rounded text-red-300">{user.id}</code></li>
                <li><span className="text-gray-500">Ruolo:</span> <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold uppercase">{profile?.role}</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* AVVISI */}
        <section className="bg-[#242438] p-6 rounded-3xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6 uppercase flex items-center gap-2">
            <AlertTriangle className="text-amber-400" /> Avvisi
          </h2>
          <div className="space-y-3">
            {!isPinnedExists && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400">
                <p className="font-bold flex items-center gap-2"><XCircle size={18} /> Colonna `is_pinned` mancante</p>
                <p className="text-sm mt-1 opacity-80">La tabella `events` non ha la colonna `is_pinned`.</p>
              </div>
            )}
            {isPinnedExists && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 flex items-center gap-2 font-bold">
                <CheckCircle size={18} /> Colonna `events.is_pinned` verificata
              </div>
            )}

            {emptyTables.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-400">
                <p className="font-bold mb-2">Tabelle Vuote ({emptyTables.length})</p>
                <div className="flex flex-wrap gap-2">
                  {emptyTables.map(t => (
                    <span key={t.name} className="bg-amber-500/20 text-xs px-2 py-1 rounded font-mono">{t.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* STATO DB TABELLE */}
        <section className="bg-[#242438] p-6 rounded-3xl border border-gray-700 shadow-xl lg:col-span-2 overflow-x-auto">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6 uppercase flex items-center gap-2">
            <Database className="text-indigo-400" /> Tabelle Database
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a2a] text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-3 rounded-tl-lg">Tabella</th>
                <th className="p-3">Righe (COUNT)</th>
                <th className="p-3 rounded-tr-lg">Ultimo Inserimento (MAX)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tableStats.map(stat => (
                <tr key={stat.name} className="hover:bg-[#2a2a40] transition-colors">
                  <td className="p-3 font-mono text-blue-300">{stat.name}</td>
                  <td className="p-3">
                    {stat.error ? <span className="text-red-400 text-xs">{stat.error}</span> : <span className="font-bold text-white">{stat.count}</span>}
                  </td>
                  <td className="p-3 text-gray-500">
                    {stat.latest ? new Date(stat.latest).toLocaleString('it-IT') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* MEMBRI ATTIVI */}
        <section className="bg-[#242438] p-6 rounded-3xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6 uppercase flex items-center gap-2">
            <Users className="text-emerald-400" /> Membri Attivi
          </h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {membersData.map(m => (
              <div key={m.id} className="bg-[#1a1a2a] p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white">{m.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                    m.role === 'founder' ? 'bg-red-500/20 text-red-400' :
                    m.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' :
                    m.role === 'redattore' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>{m.role}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Email: {m.email}</p>
                  <p>Ultimo accesso: {m.last_sign_in_at ? new Date(m.last_sign_in_at).toLocaleString('it-IT') : 'Mai'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ULTIME AZIONI */}
        <section className="bg-[#242438] p-6 rounded-3xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold font-barlow text-white mb-6 uppercase flex items-center gap-2">
            <CheckCircle className="text-rose-400" /> Ultime Azioni (Log)
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {activityLog && activityLog.length > 0 ? (
              activityLog.map((log: any) => (
                <div key={log.id} className="text-sm bg-[#1a1a2a] p-3 rounded-lg border border-gray-800 flex gap-3 items-start">
                  <span className="text-gray-500 min-w-[65px]">{new Date(log.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                  <p className="text-gray-300">
                    <span className="font-bold text-white">{log.profiles?.name || 'Utente'}</span> {log.action}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">Nessuna azione registrata.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
