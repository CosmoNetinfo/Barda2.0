/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, X } from 'lucide-react'
import EventRSVPButtons from './EventRSVPButtons'

interface EventCalendarViewProps {
  events: any[]
  rsvps: any[]
  userId: string
}

export default function EventCalendarView({ events, rsvps, userId }: EventCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Nomi dei mesi e giorni
  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]
  const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  // Calcola i giorni del mese
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  // Ottieni il giorno della settimana (0 = Dom, 1 = Lun, ..., 6 = Sab)
  // Lo convertiamo in 0 = Lun, ..., 6 = Dom
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7

  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const numDaysInMonth = lastDayOfMonth.getDate()

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()

  const calendarCells = []

  // Giorni del mese precedente per riempire l'offset iniziale
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      dateString: `${currentMonth === 0 ? currentYear - 1 : currentYear}-${String(currentMonth === 0 ? 12 : currentMonth).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`
    })
  }

  // Giorni del mese corrente
  for (let i = 1; i <= numDaysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      dateString: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  // Giorni del mese successivo per completare l'ultima riga (multiplo di 7)
  const remainingCells = 42 - calendarCells.length
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      dateString: `${currentMonth === 11 ? currentYear + 1 : currentYear}-${String(currentMonth === 11 ? 1 : currentMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedEvent(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedEvent(null)
  }

  // Raggruppa gli eventi per data (YYYY-MM-DD)
  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => {
      // Alcuni database salvano la data come timestamp o stringa ISO
      // Facciamo il match basandoci solo sulla parte YYYY-MM-DD
      const eventDateStr = event.date.split('T')[0]
      return eventDateStr === dateStr
    }).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }

  // Gestione click su evento
  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
  }

  // Trova le risposte dell'evento selezionato
  const getSelectedEventRSVPs = () => {
    if (!selectedEvent) return { attending: [], maybe: [], declined: [], myRsvp: null }
    const eventRsvps = rsvps.filter(r => r.event_id === selectedEvent.id) || []
    return {
      attending: eventRsvps.filter(r => r.status === 'yes'),
      maybe: eventRsvps.filter(r => r.status === 'maybe'),
      declined: eventRsvps.filter(r => r.status === 'no'),
      myRsvp: eventRsvps.find(r => r.user_id === userId)?.status || null
    }
  }

  const rsvpDetails = getSelectedEventRSVPs()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Griglia Calendario */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 flex flex-col justify-between">
        
        {/* Intestazione Mese */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-barlow text-gray-900 uppercase tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Nomi dei Giorni */}
        <div className="grid grid-cols-7 text-center font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
          {dayNames.map(name => (
            <div key={name} className="py-2">{name}</div>
          ))}
        </div>

        {/* Celle dei Giorni */}
        <div className="grid grid-cols-7 grid-rows-6 gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100 min-h-[380px] md:min-h-[440px]">
          {calendarCells.map((cell, idx) => {
            const dateEvents = getEventsForDate(cell.dateString)
            const isToday = new Date().toISOString().split('T')[0] === cell.dateString

            return (
              <div
                key={idx}
                className={`min-h-[60px] md:min-h-[70px] bg-white rounded-xl p-1 md:p-1.5 flex flex-col justify-between border ${
                  cell.isCurrentMonth ? 'border-gray-50' : 'border-gray-50/50 opacity-40 bg-gray-50/20'
                } ${isToday ? 'ring-2 ring-[#E8201A] ring-offset-1 z-10' : ''}`}
              >
                {/* Giorno numero */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs md:text-sm font-bold flex items-center justify-center rounded-full w-5 h-5 md:w-6 md:h-6 ${
                      isToday ? 'bg-[#E8201A] text-white' : 'text-gray-700'
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>

                {/* Lista Eventi nel Giorno */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[38px] md:max-h-[48px] custom-scrollbar">
                  {dateEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className={`w-full text-left text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate transition-all block ${
                        selectedEvent?.id === event.id
                          ? 'bg-[#E8201A] text-white shadow-sm'
                          : 'bg-red-50 text-[#E8201A] hover:bg-red-100 border border-red-100/50'
                      }`}
                    >
                      {event.time && <span className="opacity-70 mr-1">{event.time}</span>}
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pannello Dettaglio Evento Selezionato */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between min-h-[300px]">
        {selectedEvent ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            {/* Header Dettaglio */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8201A] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                  Evento Selezionato
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-gray-900 font-barlow uppercase tracking-tight mb-2">
                {selectedEvent.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <CalendarIcon size={16} className="text-[#E8201A]" />
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {selectedEvent.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Clock size={16} className="text-blue-500" />
                    <span>Orario: {selectedEvent.time}</span>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <MapPin size={16} className="text-[#2E8B3A]" />
                    <span>Luogo: {selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-600 leading-relaxed mb-6">
                  {selectedEvent.description}
                </div>
              )}

              {/* Risposte dei Membri nell'evento selezionato */}
              {(rsvpDetails.attending.length > 0 || rsvpDetails.maybe.length > 0 || rsvpDetails.declined.length > 0) && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Partecipanti</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {rsvpDetails.attending.length > 0 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-emerald-600 shrink-0 min-w-[70px]">Sì ({rsvpDetails.attending.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {rsvpDetails.attending.map((rsvp, idx) => {
                            const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                            return (
                              <span key={idx} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100 flex items-center gap-1">
                                {profile?.avatar_url && <img src={profile.avatar_url} className="w-3 h-3 rounded-full" alt="" />}
                                {profile?.name || 'Utente'}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {rsvpDetails.maybe.length > 0 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-amber-600 shrink-0 min-w-[70px]">Forse ({rsvpDetails.maybe.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {rsvpDetails.maybe.map((rsvp, idx) => {
                            const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                            return (
                              <span key={idx} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-100 flex items-center gap-1">
                                {profile?.avatar_url && <img src={profile.avatar_url} className="w-3 h-3 rounded-full" alt="" />}
                                {profile?.name || 'Utente'}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {rsvpDetails.declined.length > 0 && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-gray-500 shrink-0 min-w-[70px]">No ({rsvpDetails.declined.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {rsvpDetails.declined.map((rsvp, idx) => {
                            const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
                            return (
                              <span key={idx} className="bg-gray-50 text-gray-650 px-2 py-0.5 rounded-full font-medium border border-gray-200 flex items-center gap-1">
                                {profile?.avatar_url && <img src={profile.avatar_url} className="w-3 h-3 rounded-full" alt="" />}
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

            {/* RSVP Buttons */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <EventRSVPButtons eventId={selectedEvent.id} currentStatus={rsvpDetails.myRsvp} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-12">
            <CalendarIcon size={48} className="mb-4 opacity-20 text-[#E8201A]" />
            <h4 className="font-bold text-gray-700 mb-1">Seleziona un evento</h4>
            <p className="text-sm max-w-[200px]">Clicca su un evento nel calendario per vederne i dettagli e iscriverti.</p>
          </div>
        )}
      </div>
    </div>
  )
}
