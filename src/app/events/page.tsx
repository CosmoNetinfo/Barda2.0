import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import EventForm from './components/EventForm'
import EventRSVPButtons from './components/EventRSVPButtons'

export default async function EventsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch events with author profiles
  const { data: events } = await supabase
    .from('events')
    .select(`
      *,
      profiles!events_author_id_fkey(name, avatar_url)
    `)
    .order('date', { ascending: true })

  // Fetch RSVPs
  const { data: rsvps } = await supabase
    .from('event_rsvp')
    .select(`
      event_id,
      status,
      user_id,
      profiles!event_rsvp_user_id_fkey(name, avatar_url)
    `)

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-200">
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

      {events?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Nessun evento in programma</h3>
          <p className="mt-1">Che ne dici di organizzare una cena?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events?.map(event => {
            const eventRsvps = rsvps?.filter(r => r.event_id === event.id) || []
            const myRsvp = eventRsvps.find(r => r.user_id === user.id)?.status || null
            const attending = eventRsvps.filter(r => r.status === 'yes')

            // Formatting date beautifully
            const eventDate = new Date(event.date)
            const month = eventDate.toLocaleString('it-IT', { month: 'short' }).toUpperCase()
            const day = eventDate.getDate()
            const weekday = eventDate.toLocaleString('it-IT', { weekday: 'long' })

            return (
              <div key={event.id} className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Date Badge */}
                  <div className="bg-gradient-to-b from-gray-50 to-gray-100 sm:w-32 rounded-2xl flex flex-row sm:flex-col items-center justify-center p-4 border border-gray-100/50">
                    <span className="text-sm font-bold text-red-500 mr-2 sm:mr-0">{month}</span>
                    <span className="text-4xl font-black tracking-tighter text-gray-800">{day}</span>
                    <span className="text-xs font-semibold text-gray-400 capitalize sm:mt-1 hidden sm:block">{weekday}</span>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 mb-4">
                        {event.time && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Clock size={16} className="text-blue-500" />
                            {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <MapPin size={16} className="text-blue-500" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-gray-100">
                      {/* Attendees Avatars */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {attending.slice(0, 5).map((rsvp, i) => {
                            const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles;
                            return profile?.avatar_url ? (
                              <img key={i} src={profile.avatar_url} alt={profile.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" title={profile.name} />
                            ) : (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs" title={profile?.name}>
                                {profile?.name?.[0] || '?'}
                              </div>
                            )
                          })}
                        </div>
                        {attending.length > 0 ? (
                          <span className="text-sm font-semibold text-gray-500">
                            {attending.length} {attending.length === 1 ? 'partecipante' : 'partecipanti'}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                            <Users size={16} /> Nessun iscritto
                          </span>
                        )}
                      </div>

                      {/* RSVP Buttons */}
                      <EventRSVPButtons eventId={event.id} currentStatus={myRsvp} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
