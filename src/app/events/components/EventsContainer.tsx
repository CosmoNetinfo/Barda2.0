/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, List as ListIcon, Clock, MapPin, Users } from 'lucide-react'
import EventCalendarView from './EventCalendarView'
import EventRSVPButtons from './EventRSVPButtons'

interface EventsContainerProps {
  events: any[]
  rsvps: any[]
  userId: string
}

export default function EventsContainer({ events, rsvps, userId }: EventsContainerProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  return (
    <div className="space-y-6">
      {/* Switcher di Vista */}
      <div className="flex justify-end">
        <div className="bg-gray-150 p-1 rounded-2xl border border-gray-200 inline-flex items-center gap-1 shadow-inner bg-gray-100">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm scale-100'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <ListIcon size={16} />
            Elenco
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#E8201A] text-white shadow-md scale-100'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <CalendarIcon size={16} />
            Calendario
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <EventCalendarView events={events} rsvps={rsvps} userId={userId} />
      ) : (
        /* Vista Elenco Esistente */
        events.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
            <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">Nessun evento in programma</h3>
            <p className="mt-1">Che ne dici di organizzare una cena?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map(event => {
              const eventRsvps = rsvps.filter(r => r.event_id === event.id) || []
              const myRsvp = eventRsvps.find(r => r.user_id === userId)?.status || null
              const attending = eventRsvps.filter(r => r.status === 'yes')
              const maybe = eventRsvps.filter(r => r.status === 'maybe')
              const declined = eventRsvps.filter(r => r.status === 'no')

              // Formatting date beautifully
              const eventDate = new Date(event.date)
              const month = eventDate.toLocaleString('it-IT', { month: 'long' }).toUpperCase()
              const day = eventDate.getDate()
              const weekday = eventDate.toLocaleString('it-IT', { weekday: 'long' })

              return (
                <div key={event.id} className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Date Badge */}
                    <div className="bg-gradient-to-b from-gray-50 to-gray-100 sm:w-32 rounded-2xl flex flex-row sm:flex-col items-center justify-center p-4 border border-gray-100/50">
                      <span className="text-sm font-bold text-[#E8201A] mr-2 sm:mr-0">{month}</span>
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

                        {/* Detailed RSVP list */}
                        {(attending.length > 0 || maybe.length > 0 || declined.length > 0) && (
                          <div className="mb-6 pt-4 border-t border-gray-100 space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Risposte dei membri</h4>
                            <div className="space-y-2">
                              {attending.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="font-bold text-emerald-600 shrink-0 min-w-[80px]">Ci sono:</span>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {attending.map((rsvp, idx) => {
                                      const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                                      return (
                                        <span key={idx} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium border border-emerald-100">
                                          {profile?.avatar_url && <img src={profile.avatar_url} className="w-3.5 h-3.5 rounded-full" alt="" />}
                                          {profile?.name || 'Utente'}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {maybe.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="font-bold text-amber-600 shrink-0 min-w-[80px]">Forse:</span>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {maybe.map((rsvp, idx) => {
                                      const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                                      return (
                                        <span key={idx} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium border border-amber-100">
                                          {profile?.avatar_url && <img src={profile.avatar_url} className="w-3.5 h-3.5 rounded-full" alt="" />}
                                          {profile?.name || 'Utente'}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {declined.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="font-bold text-gray-500 shrink-0 min-w-[80px]">Non posso:</span>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {declined.map((rsvp, idx) => {
                                      const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                                      return (
                                        <span key={idx} className="inline-flex items-center gap-1 bg-gray-50 text-gray-650 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                                          {profile?.avatar_url && <img src={profile.avatar_url} className="w-3.5 h-3.5 rounded-full" alt="" />}
                                          {profile?.name || 'Utente'}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-gray-100">
                        {/* Attendees Avatars */}
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                            {attending.slice(0, 5).map((rsvp, i) => {
                              const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                              return profile?.avatar_url ? (
                                <img key={i} src={profile.avatar_url} alt={profile.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" title={profile.name} />
                              ) : (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-red-50 text-[#E8201A] flex items-center justify-center font-bold text-xs" title={profile?.name}>
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
        )
      )}
    </div>
  )
}
