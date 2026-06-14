'use client'

import { useState } from 'react'
import { createPlace, updatePlaceStatus } from '../../actions/places'

type Place = {
  id: string
  name: string
  category: string
  address: string
  maps_url: string
  status: string
  rating: number
  visited_at: string
  author: { email: string }
}

export default function PlaceActions({ groupId, places }: { groupId: string, places: Place[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('groupId', groupId)
    const res = await createPlace(formData)
    if (res?.error) setError(res.error)
    else setIsCreating(false)
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Luoghi da Provare</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Aggiungi Posto
        </button>
      </div>

      {isCreating && (
        <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Nuovo Luogo</h3>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Nome del Locale/Posto</label>
            <input id="name" name="name" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Pizzeria Da Michele" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">Categoria</label>
              <select id="category" name="category" className="w-full rounded-md border p-2 text-sm bg-white">
                <option value="🍕 Cibo/Ristorante">🍕 Cibo/Ristorante</option>
                <option value="🍹 Aperitivo/Pub">🍹 Aperitivo/Pub</option>
                <option value="🌲 Natura/Gita">🌲 Natura/Gita</option>
                <option value="🎮 Intrattenimento">🎮 Intrattenimento</option>
                <option value="💡 Altro">💡 Altro</option>
              </select>
            </div>
            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-medium">Indirizzo (Opzionale)</label>
              <input id="address" name="address" className="w-full rounded-md border p-2 text-sm" placeholder="Es. Via Roma 1" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="mapsUrl" className="mb-1 block text-sm font-medium">Link Google Maps (Opzionale)</label>
            <input id="mapsUrl" name="mapsUrl" type="url" className="w-full rounded-md border p-2 text-sm" placeholder="https://maps.app.goo.gl/..." />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
            <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Aggiungi</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {places.map((place) => (
          <div key={place.id} className="rounded-lg border bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{place.name}</h3>
                {place.category && <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">{place.category}</span>}
              </div>
              
              {place.address && <p className="text-sm text-gray-600 mb-1">📍 {place.address}</p>}
              
              {place.maps_url && (
                <a href={place.maps_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                  Apri su Google Maps ↗
                </a>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              {place.status === 'da_provare' ? (
                <>
                  <span className="text-sm font-bold text-gray-500 uppercase">Da provare</span>
                  <button 
                    onClick={() => updatePlaceStatus(place.id, groupId, 'visitato', 5)}
                    className="text-xs font-bold px-3 py-1.5 rounded-md bg-black text-white hover:bg-black/90"
                  >
                    Segna come Visitato
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-green-600 uppercase">Visitato ✅</span>
                    <span className="text-xs text-gray-400">il {new Date(place.visited_at).toLocaleDateString()}</span>
                  </div>
                  {/* Rating stelline molto basilare per ora */}
                  <div className="text-lg" title={`Voto: ${place.rating || 5}/5`}>
                    {'⭐'.repeat(place.rating || 5)}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {places.length === 0 && !isCreating && (
          <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-gray-500">
            Nessun posto da provare. Aggiungete la vostra pizzeria preferita!
          </div>
        )}
      </div>
    </div>
  )
}
