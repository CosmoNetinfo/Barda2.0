'use client'

import { useState } from 'react'
import { createPoll } from '@/app/actions/polls'
import { PlusCircle, Loader2, X } from 'lucide-react'

export default function PollForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<string[]>(['', ''])
  const [error, setError] = useState('')

  const addOption = () => setOptions([...options, ''])
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const validOptions = options.filter(o => o.trim() !== '')
    formData.append('options', JSON.stringify(validOptions))
    const res = await createPoll(formData)
    setLoading(false)
    
    if (res?.error) {
      setError(res.error)
      return
    }
    
    setIsOpen(false)
    setOptions(['', ''])
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-2xl p-5 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300 font-bold"
      >
        <PlusCircle size={22} />
        <span>Crea un Sondaggio</span>
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
          <div className="md:hidden w-full flex justify-center py-2 bg-violet-50/80">
            <div className="w-12 h-1.5 bg-violet-200 rounded-full"></div>
          </div>

          <div className="bg-violet-50/80 p-5 flex justify-between items-center border-b border-violet-100">
            <h3 className="font-bold text-violet-900 text-lg">Nuovo Sondaggio</h3>
            <button type="button" onClick={() => setIsOpen(false)} className="text-violet-600 hover:text-violet-800 text-sm font-semibold transition-colors">Annulla</button>
          </div>
          <form action={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto pb-safe">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Domanda</label>
              <input 
                type="text" 
                name="question" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all placeholder-gray-400 font-bold text-lg text-gray-900"
                placeholder="Es. Quando facciamo la prossima riunione?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tipo di voto</label>
                <select 
                  name="type"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-medium text-gray-700 appearance-none text-sm"
                >
                  <option value="single">Scelta Singola</option>
                  <option value="multi">Scelta Multipla</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Scadenza (opz.)</label>
                <input 
                  type="date" 
                  name="expires_at"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-medium text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Opzioni</label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Opzione ${index + 1}`}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all font-medium text-gray-700"
                    />
                    {options.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => removeOption(index)}
                        className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={addOption}
                className="mt-3 text-violet-600 font-semibold text-sm hover:underline min-h-[44px] flex items-center"
              >
                + Aggiungi un&apos;altra opzione
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-medium">
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || options.filter(o => o.trim() !== '').length < 2}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold min-h-[44px] py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Pubblica Sondaggio'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
