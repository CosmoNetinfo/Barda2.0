'use client'

import { useState, useTransition, useRef } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Loader2, Camera, User, FileText } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Jasper&backgroundColor=d1d4f9',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Molly&backgroundColor=ffdfbf',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=c0aede',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=ffdfbf'
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // Convert to WebP and resize
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      
      const compressedFile: File = await new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas non supportato'));
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              resolve(new File([blob], 'avatar.webp', { type: 'image/webp' }));
            } else {
              reject(new Error('Errore nella conversione immagine'));
            }
          }, 'image/webp', 0.8);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Errore nel caricamento immagine'));
        };
        img.src = objectUrl;
      });

      const supabase = createClient()
      const filePath = `${profile.id}/avatar.webp`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { upsert: true, cacheControl: '3600' })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      // Aggiungiamo un timestamp per forzare il refresh della cache del browser
      const newAvatarUrl = `${data.publicUrl}?t=${Date.now()}`
      setAvatarUrl(newAvatarUrl)
      
      // Auto-save the profile after a successful upload
      startTransition(async () => {
        try {
          await updateProfile(name, bio, newAvatarUrl)
          setSuccessMsg('Foto caricata e salvata con successo!')
          setTimeout(() => setSuccessMsg(''), 3000)
        } catch {
          // Ignore
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message || 'Errore durante il caricamento')
      else setErrorMsg('Errore durante il caricamento')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    
    startTransition(async () => {
      try {
        await updateProfile(name, bio, avatarUrl)
        setSuccessMsg('Profilo aggiornato con successo!')
        setTimeout(() => setSuccessMsg(''), 3000)
      } catch (err: unknown) {
        if (err instanceof Error) setErrorMsg(err.message || 'Errore durante l\'aggiornamento')
        else setErrorMsg('Errore durante l\'aggiornamento')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Avatar Section */}
        <div className="shrink-0 flex flex-col items-center gap-4 w-full md:w-auto">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold border-4 border-gray-100 shadow-sm">
                {name ? name[0].toUpperCase() : '?'}
              </div>
            )}
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="text-center w-full">
            <p className="text-sm font-bold text-gray-700 mb-2">Oppure scegli un avatar</p>
            <div className="flex flex-wrap justify-center gap-2">
              {DEFAULT_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 overflow-hidden ${avatarUrl === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'}`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Profile Info Section */}
        <div className="flex-1 space-y-4 w-full">
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
        disabled={isPending || uploading}
        className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Salva Profilo'}
      </button>
    </form>
  )
}
