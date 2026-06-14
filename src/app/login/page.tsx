import { login, signup, signInWithGoogle } from './actions'
import { Info } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-black">
        <div className="flex flex-col items-center mb-8">
          <img src="/bardasci-logo.png" alt="I Bardasci Logo" className="h-16 w-auto object-contain mb-4" />
          <h1 className="text-3xl font-extrabold font-barlow text-primary uppercase tracking-tight">I Bardasci</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Accedi all&apos;app per continuare</p>
        </div>
        
        {searchParams?.message && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-medium text-center">
            {searchParams.message}
          </div>
        )}
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="rounded-md border p-2 text-sm"
              placeholder="mario.rossi@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="rounded-md border p-2 text-sm"
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button 
              formAction={login} 
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            >
              Accedi
            </button>
            <button 
              formAction={signup} 
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Registrati
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Oppure</span>
            </div>
          </div>
          
          <button 
            formAction={signInWithGoogle} 
            formNoValidate
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
              <Info size={18} className="text-primary" />
              Come accedere a Bardò
            </h3>
            <ol className="text-sm text-gray-500 space-y-2 mb-4 list-decimal pl-5">
              <li>Clicca &quot;Accedi con Google&quot;</li>
              <li>Scegli il tuo account Google</li>
              <li>Al primo accesso il tuo profilo viene creato automaticamente</li>
              <li>Sei dentro — nessun altro passaggio richiesto</li>
            </ol>
            <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs font-medium border border-amber-100">
              <span className="font-bold block mb-1">⚠️ Accesso su invito</span>
              Bardò è riservato ai membri de Li Bardasci. Se non riesci ad accedere, contatta un admin o il founder.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
