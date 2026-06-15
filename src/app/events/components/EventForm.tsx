'use client'

import { useState } from 'react'
import { createEvent } from '@/app/actions/events'
import { PlusCircle, Loader2, MapPin } from 'lucide-react'

export default function EventForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await createEvent(formData)
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
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white rounded-2xl p-5 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 font-bold"
      >
        <PlusCircle size={22} />
        <span>Organizza Evento</span>
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
          <div className="md:hidden w-full flex justify-center py-2 bg-red-50/80">
            <div className="w-12 h-1.5 bg-red-200 rounded-full"></div>
          </div>

          <div className="bg-red-50/80 p-5 flex justify-between items-center border-b border-red-100">
            <h3 className="font-bold text-red-900 text-lg">Nuovo Evento</h3>
            <button onClick={() => setIsOpen(false)} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors">Annulla</button>
          </div>
          <form action={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-safe">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Titolo Evento</label>
              <input 
                type="text" 
                name="title" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 font-bold text-lg text-gray-900"
                placeholder="Es. Cena di Redazione"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Data</label>
              <div className="grid grid-cols-3 gap-2">
                {/* GIORNO */}
                <select name="day" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-700">
                  <option value="">Giorno</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* MESE */}
                <select name="month" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-700">
                  <option value="">Mese</option>
                  {['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                    'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
                    .map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>

                {/* ANNO */}
                <select name="year" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-700">
                  <option value="">Anno</option>
                  {[2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ora</label>
              <div className="grid grid-cols-2 gap-2">
                {/* ORE */}
                <select name="hour" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-700">
                  <option value="">Ore</option>
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>

                {/* MINUTI */}
                <select name="minute" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-gray-700">
                  <option value="">Minuti</option>
                  {['00', '15', '30', '45'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Luogo</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="location" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                  placeholder="Es. Pizzeria del Corso"
                />
                <MapPin size={18} className="absolute left-3 top-3.5 text-primary" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Descrizione (opzionale)</label>
              <textarea 
                name="description" 
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="Qualche info in più..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-600 text-white font-bold min-h-[44px] py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Conferma Evento'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
