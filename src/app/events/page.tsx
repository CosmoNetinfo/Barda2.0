import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { Calendar } from 'lucide-react'
import EventForm from './components/EventForm'
import EventsContainer from './components/EventsContainer'

export default async function EventsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch events
  const { data: eventsRaw } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  // Fetch RSVPs using admin client to bypass potential RLS SELECT restrictions
  const adminClient = createAdminClient()
  const { data: rsvpsRaw } = await adminClient
    .from('event_rsvp')
    .select('*')

  // Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Map author profile to events
  const events = eventsRaw?.map(event => ({
    ...event,
    profiles: profileMap.get(event.author_id) || null
  })) || []

  // Map user profile to RSVPs
  const rsvps = rsvpsRaw?.map(rsvp => ({
    ...rsvp,
    profiles: profileMap.get(rsvp.user_id) || null
  })) || []

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-primary to-primary-600 text-white p-4 rounded-3xl shadow-lg shadow-primary/20">
            <Calendar size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Eventi</h1>
            <p className="text-gray-500 font-medium mt-1">Riunioni, riprese, cene e aperitivi.</p>
          </div>
        </div>
        
        <div className="w-full md:w-64">
          <EventForm />
        </div>
      </header>

      <EventsContainer events={events} rsvps={rsvps} userId={user.id} />
    </div>
  )
}
