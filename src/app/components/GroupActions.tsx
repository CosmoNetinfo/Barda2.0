'use client'

import { useState } from 'react'
import { createGroup, joinGroup } from '../actions/groups'

export default function GroupActions() {
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createGroup(formData)
    if (result.error) setError(result.error)
    else setIsCreating(false)
    setLoading(false)
  }

  async function handleJoin(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await joinGroup(formData)
    if (result.error) setError(result.error)
    else setIsJoining(false)
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => { setIsCreating(true); setIsJoining(false); setError(null) }}
        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
      >
        + Nuovo Gruppo
      </button>
      <button 
        onClick={() => { setIsJoining(true); setIsCreating(false); setError(null) }}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Usa codice invito
      </button>

      {/* Modal / Inline form per creare un gruppo */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Crea un nuovo gruppo</h3>
            <form action={handleCreate} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Nome del Gruppo</label>
                <input id="name" name="name" required className="mt-1 w-full rounded-md border p-2 text-sm" placeholder="Es. I Bardasci" />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">Descrizione (Opzionale)</label>
                <textarea id="description" name="description" className="mt-1 w-full rounded-md border p-2 text-sm" placeholder="Breve descrizione..." />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
                <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Crea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Inline form per unirsi a un gruppo */}
      {isJoining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Unisciti a un gruppo</h3>
            <form action={handleJoin} className="flex flex-col gap-4">
              <div>
                <label htmlFor="inviteCode" className="text-sm font-medium">Codice di Invito</label>
                <input id="inviteCode" name="inviteCode" required className="mt-1 w-full rounded-md border p-2 text-sm" placeholder="Es. a1b2c3d4" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsJoining(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
                <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Unisciti</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
