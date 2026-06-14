'use client'

import { useState } from 'react'
import { createPlace } from '@/app/actions/places'
import { PlusCircle, Loader2, MapPin, Navigation } from 'lucide-react'

export default function PlaceForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createPlace(formData)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 font-bold"
      >
        <PlusCircle size={22} />
        <span>Aggiungi un Luogo</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Form Container */}
      <div className={`fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white md:rounded-3xl rounded-t-3xl shadow-2xl border-t md:border border-gray-100 overflow-hidden transform transition-all duration-300 md:w-[450px] md:max-h-[90vh] flex flex-col ${isOpen ? 'translate-y-0 md:scale-100 opacity-100' : 'translate-y-full md:translate-y-1/2 md:scale-95 opacity-0 pointer-events-none'}`}>
        {/* Handle for Mobile Bottom Sheet */}
        <div className="md:hidden w-full flex justify-center py-2 bg-emerald-50/80">
          <div className="w-12 h-1.5 bg-emerald-200 rounded-full"></div>
        </div>

        <div className="bg-emerald-50/80 p-5 flex justify-between items-center border-b border-emerald-100">
          <h3 className="font-bold text-emerald-900 text-lg">Nuovo Luogo</h3>
          <button onClick={() => setIsOpen(false)} className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold transition-colors">Annulla</button>
        </div>
        <form action={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-safe">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome</label>
            <input 
              type="text" 
              name="name" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-400 font-bold text-lg text-gray-900"
              placeholder="Es. Pizzeria Da Michele"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
            <select 
              name="category"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 appearance-none"
            >
              <option value="Ristorante/Pizzeria">🍕 Ristorante/Pizzeria</option>
              <option value="Bar/Pub">🍺 Bar/Pub</option>
              <option value="Location Riprese">🎬 Location Riprese</option>
              <option value="Sede/Riunione">🏢 Sede/Riunione</option>
              <option value="Altro">📍 Altro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Indirizzo</label>
            <div className="relative">
              <input 
                type="text" 
                name="address" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                placeholder="Via Roma 1, Spoleto"
              />
              <MapPin size={18} className="absolute left-3 top-3.5 text-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Google Maps (opzionale)</label>
            <div className="relative">
              <input 
                type="url" 
                name="maps_url" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                placeholder="https://maps.app.goo.gl/..."
              />
              <Navigation size={18} className="absolute left-3 top-3.5 text-emerald-500" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold min-h-[44px] py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salva Luogo'}
          </button>
        </form>
      </div>
    </>
  )
}
