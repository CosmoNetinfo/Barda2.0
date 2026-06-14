'use client'

import { useState } from 'react'
import { createEvent, rsvpEvent } from '../../actions/events'

type Event = {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  created_at: string
  author: { email: string }
  rsvps: { user_id: string, status: string, user: { email: string } }[]
}

export default function EventActions({ groupId, events, currentUserId }: { groupId: string, events: Event[], currentUserId: string }) {
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('groupId', groupId)
    const res = await createEvent(formData)
    if (res?.error) setError(res.error)
    else setIsCreating(false)
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Appuntamenti ed Eventi</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Nuovo Evento
        </button>
      </div>

      {isCreating && (
        <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Programma un Evento</h3>
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium">Titolo Evento</label>
            <input id="title" name="title" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Calcetto del Giovedì" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium">Data</label>
              <input type="date" id="date" name="date" required className="w-full rounded-md border p-2 text-sm" />
            </div>
            <div>
              <label htmlFor="time" className="mb-1 block text-sm font-medium">Ora (Opzionale)</label>
              <input type="time" id="time" name="time" className="w-full rounded-md border p-2 text-sm" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="mb-1 block text-sm font-medium">Luogo (Opzionale)</label>
            <input id="location" name="location" className="w-full rounded-md border p-2 text-sm" placeholder="Indirizzo o nome locale" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-1 block text-sm font-medium">Descrizione (Opzionale)</label>
            <textarea id="description" name="description" rows={2} className="w-full rounded-md border p-2 text-sm" placeholder="Dettagli..." />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
            <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Crea Evento</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {events.map((event) => {
          const yesCount = event.rsvps.filter(r => r.status === 'yes').length
          const noCount = event.rsvps.filter(r => r.status === 'no').length
          const maybeCount = event.rsvps.filter(r => r.status === 'maybe').length
          const myRsvp = event.rsvps.find(r => r.user_id === currentUserId)?.status

          const dateObj = new Date(event.date)
          const dateString = dateObj.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

          return (
            <div key={event.id} className="rounded-lg border bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                    {dateString} {event.time && `alle ${event.time}`}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                
                {event.location && (
                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                    📍 {event.location}
                  </p>
                )}
                
                {event.description && <p className="mt-4 text-gray-700">{event.description}</p>}
                <p className="mt-4 text-xs text-gray-400">Creato da {event.author?.email.split('@')[0]}</p>
              </div>

              {/* Box RSVP */}
              <div className="md:w-64 shrink-0 rounded-lg bg-gray-50 p-4 border border-gray-100">
                <p className="text-sm font-semibold text-center mb-3">Ci sarai?</p>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => rsvpEvent(event.id, groupId, 'yes')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md border transition-colors ${myRsvp === 'yes' ? 'bg-green-600 text-white border-green-700' : 'bg-white text-green-700 border-green-200 hover:bg-green-50'}`}
                  >
                    Sì
                  </button>
                  <button 
                    onClick={() => rsvpEvent(event.id, groupId, 'maybe')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md border transition-colors ${myRsvp === 'maybe' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50'}`}
                  >
                    Forse
                  </button>
                  <button 
                    onClick={() => rsvpEvent(event.id, groupId, 'no')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md border transition-colors ${myRsvp === 'no' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
                  >
                    No
                  </button>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>✅ Presenti:</span> <span className="font-bold">{yesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🤔 In forse:</span> <span className="font-bold">{maybeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>❌ Assenti:</span> <span className="font-bold">{noCount}</span>
                  </div>
                </div>
              </div>

            </div>
          )
        })}

        {events.length === 0 && !isCreating && (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            Nessun evento in programma.
          </div>
        )}
      </div>
    </div>
  )
}
