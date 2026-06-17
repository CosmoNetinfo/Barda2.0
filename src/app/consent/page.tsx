'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveConsent } from '@/app/actions/consent'
import Link from 'next/link'

export default function ConsentPage() {
  const [consentGiven, setConsentGiven] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = () => {
    if (!consentGiven) return

    setError(null)
    startTransition(async () => {
      const result = await saveConsent()
      if (result.error) {
        setError(result.error)
      } else {
        router.replace('/')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-gray-800 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        {/* Intestazione */}
        <header className="border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img src="/bardasci-logo.png" alt="Logo" className="h-10 object-contain" />
            <span className="font-barlow font-extrabold text-3xl tracking-tight uppercase text-gray-900">Bardà</span>
          </div>
          <h1 className="text-3xl font-extrabold font-barlow text-gray-900 uppercase tracking-tight mb-2">
            Consenso Privacy Richiesto
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Per continuare a usare Bardà, ti chiediamo di leggere e accettare la nostra informativa sulla privacy.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Box Informativa Scrollabile */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 h-60 overflow-y-auto text-xs text-gray-600 space-y-4 mb-6 custom-scrollbar">
          <p className="font-semibold text-gray-700">
            Informativa sul trattamento dei dati personali (art. 13 GDPR)
          </p>
          <p>
            L&apos;applicazione web privata &quot;Bardà&quot; raccoglie ed elabora alcuni dati personali (come nome, email, foto profilo e contenuti inseriti) esclusivamente per finalità di coordinamento interno del gruppo &quot;Li Bardasci&quot;. I dati non saranno ceduti a terzi.
          </p>
          <p>
            <strong>Titolare del trattamento:</strong> <a href="https://www.cosmonet.info" target="_blank" rel="noopener noreferrer" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">Daniele Spalletti (CosmoNet.info)</a><br />
            <strong>Contatto:</strong> <a href="mailto:admindany@gmail.com" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">admindany@gmail.com</a>
          </p>
          <p>
            Puoi leggere il testo completo dell&apos;informativa aprendo la <Link href="/privacy" target="_blank" className="text-[#E8201A] underline font-medium">Privacy Policy completa</Link> in una nuova scheda.
          </p>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 mb-8">
          <input
            type="checkbox"
            id="privacy-consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 w-5 h-5 accent-[#E8201A] cursor-pointer flex-shrink-0"
          />
          <label htmlFor="privacy-consent" className="text-sm text-gray-600 cursor-pointer select-none">
            Ho letto e accetto la{' '}
            <a href="/privacy" target="_blank" className="text-[#E8201A] underline font-medium">
              Privacy Policy
            </a>
            . Acconsento al trattamento dei miei dati personali per l&apos;utilizzo di Bardà.
          </label>
        </div>

        {/* Pulsante */}
        <button
          onClick={handleSubmit}
          disabled={!consentGiven || isPending}
          className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-base transition-all ${
            !consentGiven || isPending
              ? 'bg-gray-300 opacity-60 cursor-not-allowed'
              : 'bg-[#E8201A] hover:bg-[#d11913] active:scale-[0.98]'
          }`}
        >
          {isPending ? 'Salvataggio in corso...' : 'Accetto e continuo'}
        </button>

      </div>
    </div>
  )
}
