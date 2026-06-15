'use client'

import { useState } from 'react'
import { createPlace } from '@/app/actions/places'
import { PlusCircle, Loader2, MapPin, Navigation } from 'lucide-react'

export default function PlaceForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await createPlace(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-success to-success-600 text-white rounded-2xl p-5 shadow-lg shadow-success/30 hover:shadow-success/50 hover:-translate-y-1 transition-all duration-300 font-bold"
      >
        <PlusCircle size={22} />
        <span>Aggiungi un Luogo</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay & Wrapper */}
      <div 
        className={`fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Form Container */}
        <div 
          className={`relative w-full md:w-[450px] bg-white md:rounded-3xl rounded-t-3xl shadow-2xl border-t md:border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 ${isOpen ? 'translate-y-0 md:scale-100 opacity-100' : 'translate-y-full md:translate-y-8 md:scale-95 opacity-0'}`}
        >
          {/* Handle for Mobile Bottom Sheet */}
          <div className="md:hidden w-full flex justify-center py-2 bg-success-50/80">
            <div className="w-12 h-1.5 bg-success-200 rounded-full"></div>
          </div>

          <div className="bg-success-50/80 p-5 flex justify-between items-center border-b border-success-100">
            <h3 className="font-bold text-success-900 text-lg">Nuovo Luogo</h3>
            <button onClick={() => setIsOpen(false)} className="text-success-600 hover:text-success-800 text-sm font-semibold transition-colors">Annulla</button>
          </div>
          <form action={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-safe">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome</label>
              <input 
                type="text" 
                name="name" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-success focus:border-success outline-none transition-all placeholder-gray-400 font-bold text-lg text-gray-900"
                placeholder="Es. Pizzeria Da Michele"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoria</label>
              <select 
                name="category"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-success focus:border-success outline-none transition-all font-medium text-gray-700 appearance-none bg-white"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-success outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                  placeholder="Via Roma 1, Spoleto"
                />
                <MapPin size={18} className="absolute left-3 top-3.5 text-success" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Google Maps (opzionale)</label>
              <div className="relative">
                <input 
                  type="url" 
                  name="maps_url" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-success outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <Navigation size={18} className="absolute left-3 top-3.5 text-success" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-success hover:bg-success-600 text-white font-bold min-h-[44px] py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salva Luogo'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
