'use client'

import { updatePlaceStatus } from '@/app/actions/places'
import { MapPin, Navigation, CheckCircle, Star } from 'lucide-react'
import { useTransition } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlaceItem({ place }: { place: any }) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== place.status) {
      startTransition(() => { updatePlaceStatus(place.id, newStatus) })
    }
  }

  const handleRating = (rating: number) => {
    startTransition(() => { updatePlaceStatus(place.id, place.status, rating) })
  }

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ${
      place.status === 'visitato' ? 'bg-emerald-50/30 border-emerald-100 opacity-90' : 
      'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200'
    }`}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              place.status === 'da_provare' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {place.status === 'da_provare' ? 'Da Provare' : 'Visitato'}
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
              {place.category}
            </span>
          </div>
          
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {place.name}
          </h4>
          
          {place.address && (
            <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-4">
              <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
              <span>{place.address}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {place.maps_url && (
              <a 
                href={place.maps_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                title="Apri su Maps"
              >
                <Navigation size={18} />
                <span className="text-xs font-bold hidden sm:block">Apri</span>
              </a>
            )}
          </div>

          {place.status === 'da_provare' ? (
            <button 
              onClick={() => handleStatusChange('visitato')}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-600 hover:shadow transition-all disabled:opacity-50"
            >
              <CheckCircle size={16} />
              <span>Segna come visitato</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => handleRating(star)}
                  disabled={isPending}
                  className={`focus:outline-none transition-colors ${isPending ? 'opacity-50' : 'hover:scale-110'}`}
                >
                  <Star 
                    size={20} 
                    className={
                      (place.rating || 0) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-gray-200 text-gray-200 hover:fill-amber-200 hover:text-amber-200'
                    } 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
