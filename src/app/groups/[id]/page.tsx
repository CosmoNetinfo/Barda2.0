import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import IdeaActions from './IdeaActions'
import EventActions from './EventActions'
import TaskActions from './TaskActions'
import PlaceActions from './PlaceActions'
import PollActions from './PollActions'

export default async function GroupPage({ 
  params,
  searchParams 
}: { 
  params: { id: string },
  searchParams: { tab?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const tab = searchParams.tab || 'ideas'

  // Otteniamo il gruppo
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('*')
    .eq('id', params.id)
    .single()

  if (groupError || !group) {
    return <div className="p-8 text-center text-red-600">Gruppo non trovato o accesso negato.</div>
  }

  // Fetch Ideas
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*, author:author_id(email), votes:idea_votes(user_id, vote)')
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch Events
  const { data: events } = await supabase
    .from('events')
    .select('*, author:author_id(email), rsvps:event_rsvp(user_id, status)')
    .eq('group_id', params.id)
    .order('date', { ascending: true })

  // Fetch Tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, author:author_id(email), assignees:task_assignees(user_id, user:user_id(email))')
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch Places
  const { data: places } = await supabase
    .from('places')
    .select('*, author:author_id(email)')
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch Polls
  const { data: polls } = await supabase
    .from('polls')
    .select(`
      *, 
      author:author_id(email), 
      options:poll_options(id, label),
      votes:poll_votes(option_id, user_id)
    `)
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })

  const tabs = [
    { id: 'ideas', label: '💡 Idee' },
    { id: 'events', label: '📅 Eventi' },
    { id: 'polls', label: '🗳️ Sondaggi' },
    { id: 'tasks', label: '✅ Task' },
    { id: 'places', label: '📍 Luoghi' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Gruppo */}
        <header className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black">
              &larr; Torna ai Gruppi
            </Link>
          </div>
          {group.description && <p className="text-gray-600">{group.description}</p>}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Codice Invito: <strong className="text-black">{group.invite_code}</strong>
            </span>
          </div>
        </header>

        {/* Tab di navigazione */}
        <div className="mb-6 flex gap-4 border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            t.disabled ? (
              <div key={t.id} className="pb-2 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed whitespace-nowrap">
                {t.label}
              </div>
            ) : (
              <Link 
                key={t.id} 
                href={`/groups/${group.id}?tab=${t.id}`}
                className={`pb-2 text-sm font-semibold whitespace-nowrap ${tab === t.id ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
              >
                {t.label}
              </Link>
            )
          ))}
        </div>

        {/* Render Tab Content */}
        {tab === 'ideas' && <IdeaActions groupId={group.id} ideas={ideas || []} currentUserId={user.id} />}
        {tab === 'events' && <EventActions groupId={group.id} events={events || []} currentUserId={user.id} />}
        {tab === 'polls' && <PollActions groupId={group.id} polls={polls || []} currentUserId={user.id} />}
        {tab === 'tasks' && <TaskActions groupId={group.id} tasks={tasks || []} currentUserId={user.id} />}
        {tab === 'places' && <PlaceActions groupId={group.id} places={places || []} />}
        
      </div>
    </main>
  )
}
