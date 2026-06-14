import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin } from 'lucide-react'
import PlaceForm from './components/PlaceForm'
import PlaceItem from './components/PlaceItem'

export default async function PlacesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch places
  const { data: places } = await supabase
    .from('places')
    .select('*')
    .order('created_at', { ascending: false })

  const toVisit = places?.filter(p => p.status === 'da_provare') || []
  const visited = places?.filter(p => p.status === 'visitato') || []

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white p-4 rounded-3xl shadow-lg shadow-emerald-200">
            <MapPin size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Luoghi</h1>
            <p className="text-gray-500 font-medium mt-1">Posti da provare e posti già testati.</p>
          </div>
        </div>
        
        <div className="w-full md:w-80">
          <PlaceForm />
        </div>
      </header>

      {places?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Nessun luogo salvato</h3>
          <p className="mt-1">Aggiungi il primo ristorante o bar da provare!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {toVisit.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">📍</span>
                Da Provare
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {toVisit.map(place => (
                  <PlaceItem key={place.id} place={place} />
                ))}
              </div>
            </section>
          )}

          {visited.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">✅</span>
                Già Visitati
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visited.map(place => (
                  <PlaceItem key={place.id} place={place} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
