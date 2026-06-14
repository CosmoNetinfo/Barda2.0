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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden transform transition-all">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex justify-between items-center text-white">
        <h3 className="font-bold text-lg tracking-wide">Nuovo Task</h3>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-sm font-semibold transition-colors">Annulla</button>
      </div>
      <form action={handleSubmit} className="p-6 space-y-5">
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
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crea Task'}
        </button>
      </form>
    </div>
  )
}
