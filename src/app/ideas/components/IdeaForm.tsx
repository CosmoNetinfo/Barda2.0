'use client'

import { useState } from 'react'
import { createIdea } from '@/app/actions/ideas'
import { PlusCircle, Loader2 } from 'lucide-react'

export default function IdeaForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createIdea(formData)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-500 rounded-xl p-6 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all font-medium"
      >
        <PlusCircle size={24} />
        <span>Proponi una nuova Idea</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Form Container */}
      <div className={`fixed inset-x-0 bottom-0 z-50 md:relative md:inset-auto md:z-10 bg-white md:rounded-2xl rounded-t-3xl shadow-2xl border-t md:border border-amber-200 overflow-hidden transform transition-transform duration-300 md:translate-y-0 ${isOpen ? 'translate-y-0' : 'translate-y-full md:hidden'}`}>
        {/* Handle for Mobile Bottom Sheet */}
        <div className="md:hidden w-full flex justify-center py-2 bg-amber-50">
          <div className="w-12 h-1.5 bg-amber-200 rounded-full"></div>
        </div>

        <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
          <h3 className="font-bold text-amber-800">Nuova Idea</h3>
          <button onClick={() => setIsOpen(false)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold">Annulla</button>
        </div>
        <form action={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto pb-safe">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Es. Video interviste in piazza"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              name="category"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
            >
              <option value="articolo">📝 Articolo</option>
              <option value="video">🎥 Video</option>
              <option value="social">📱 Post Social</option>
              <option value="evento">🎭 Evento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione (opzionale)</label>
            <textarea 
              name="description" 
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Spiega meglio di cosa si tratta..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold min-h-[44px] py-3 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Pubblica Idea'}
          </button>
        </form>
      </div>
    </>
  )
}
