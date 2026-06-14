'use client'

import { useState } from 'react'
import { createTask } from '@/app/actions/tasks'
import { PlusCircle, Loader2, Calendar } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskForm({ profiles }: { profiles: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createTask(formData)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm text-gray-600 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 font-semibold group"
      >
        <PlusCircle size={22} className="group-hover:scale-110 transition-transform duration-300" />
        <span>Aggiungi un nuovo Task</span>
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
        <div className="md:hidden w-full flex justify-center py-2 bg-white">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg tracking-wide">Nuovo Task</h3>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-sm font-semibold transition-colors">Annulla</button>
        </div>
        <form action={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-safe">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cosa c&apos;è da fare?</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder-gray-400 font-medium"
              placeholder="Es. Prenotare la sala per l'evento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assegna a</label>
              <select 
                name="assignee_id"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all font-medium"
              >
                <option value="">Lascia non assegnato</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scadenza</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="due_date"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                />
                <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dettagli</label>
            <textarea 
              name="description" 
              rows={3}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder-gray-400"
              placeholder="Aggiungi qualche dettaglio se serve..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold min-h-[44px] py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crea Task'}
          </button>
        </form>
      </div>
    </>
  )
}
