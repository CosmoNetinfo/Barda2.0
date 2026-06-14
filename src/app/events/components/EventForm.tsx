'use client'

import { useState } from 'react'
import { createEvent } from '@/app/actions/events'
import { PlusCircle, Loader2, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default function EventForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createEvent(formData)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 font-bold"
      >
        <PlusCircle size={22} />
        <span>Organizza Evento</span>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all relative z-10">
      <div className="bg-blue-50/80 p-5 flex justify-between items-center border-b border-blue-100">
        <h3 className="font-bold text-blue-900 text-lg">Nuovo Evento</h3>
        <button onClick={() => setIsOpen(false)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">Annulla</button>
      </div>
      <form action={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Titolo Evento</label>
          <input 
            type="text" 
            name="title" 
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-bold text-lg text-gray-900"
            placeholder="Es. Cena di Redazione"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Data</label>
            <div className="relative">
              <input 
                type="date" 
                name="date"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
              />
              <CalendarIcon size={18} className="absolute left-3 top-3.5 text-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ora</label>
            <div className="relative">
              <input 
                type="time" 
                name="time"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
              />
              <Clock size={18} className="absolute left-3 top-3.5 text-blue-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Luogo</label>
          <div className="relative">
            <input 
              type="text" 
              name="location" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
              placeholder="Es. Pizzeria del Corso"
            />
            <MapPin size={18} className="absolute left-3 top-3.5 text-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descrizione (opzionale)</label>
          <textarea 
            name="description" 
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 text-gray-700"
            placeholder="Qualche info in più..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Conferma Evento'}
        </button>
      </form>
    </div>
  )
}
