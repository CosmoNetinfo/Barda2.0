'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Loader2, Camera, User, FileText } from 'lucide-react'

export default function ProfileForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    
    startTransition(async () => {
      try {
        await updateProfile(name, bio, avatarUrl)
        setSuccessMsg('Profilo aggiornato con successo!')
        setTimeout(() => setSuccessMsg(''), 3000)
      } catch (err: any) {
        setErrorMsg(err.message || 'Errore durante l\'aggiornamento')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="shrink-0 flex flex-col items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-gray-100 shadow-sm">
              {name ? name[0].toUpperCase() : '?'}
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Camera size={16} /> URL Avatar (Google)
            </label>
            <input 
              type="url" 
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">Incolla l&apos;URL di un&apos;immagine per il tuo avatar.</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <User size={16} /> Nome Completo
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Il tuo nome"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold text-lg text-gray-900"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FileText size={16} /> Bio ({bio.length}/160)
            </label>
            <textarea 
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Scrivi qualcosa su di te..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium text-gray-700 resize-none"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold border border-red-100">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-success/10 text-success p-3 rounded-xl text-sm font-semibold border border-success/20">
          {successMsg}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Salva Profilo'}
      </button>
    </form>
  )
}
