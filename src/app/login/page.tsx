'use client'
import { useState } from 'react'
import { signInWithGoogle } from './actions'
import { Info } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const [consentGiven, setConsentGiven] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 font-sans">
      <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-black">
        
        {/* Logo e Titolo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/bardasci-logo.png" alt="Bardà Logo" className="h-16 w-auto object-contain mb-4" />
          <h1 className="text-3xl font-extrabold font-barlow text-[#E8201A] uppercase tracking-tight">
            Benvenuto in Bardà
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Accedi all&apos;app per continuare</p>
        </div>
        
        {searchParams?.message && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-medium text-center">
            {searchParams.message}
          </div>
        )}

        {/* Form con il solo Google Login */}
        <form action={signInWithGoogle} className="flex flex-col gap-4">
          
          {/* Checkbox Privacy Policy */}
          <div className="flex items-start gap-3 mt-2 mb-4">
            <input
              type="checkbox"
              id="privacy-consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#E8201A] cursor-pointer flex-shrink-0"
            />
            <label htmlFor="privacy-consent" className="text-sm text-gray-600 cursor-pointer select-none">
              Ho letto e accetto la{' '}
              <a href="/privacy" target="_blank" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">
                Privacy Policy
              </a>
              . Acconsento al trattamento dei miei dati personali per l&apos;utilizzo di Bardà.
            </label>
          </div>
          
          {/* Pulsante Google OAuth */}
          <button 
            type="submit"
            disabled={!consentGiven}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all ${
              !consentGiven 
                ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                : 'hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853" />
            </svg>
            Accedi con Google
          </button>
        </form>

        {/* Box Informativo Guida Accesso */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                <Info size={18} className="text-[#E8201A]" />
                Guida all&apos;accesso
              </h3>
              <ol className="text-xs text-gray-500 space-y-2 list-decimal pl-4">
                <li>Spunta il checkbox di accettazione della privacy policy.</li>
                <li>Clicca su &quot;Accedi con Google&quot;.</li>
                <li>Seleziona il tuo account Google autorizzato.</li>
                <li>Se è il tuo primo accesso, il profilo verrà creato automaticamente!</li>
              </ol>
            </div>

            <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-[11px] font-medium border border-amber-100 mt-2">
              <span className="font-bold block mb-1">⚠️ Accesso riservato</span>
              Bardà è un&apos;applicazione ad accesso limitato per i soli membri de Li Bardasci.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
