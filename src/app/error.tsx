'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <span className="text-5xl">⚠️</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Qualcosa è andato storto</h2>
        <p className="text-gray-500 text-sm mb-6">
          Si è verificato un errore imprevisto durante il caricamento di questa pagina.
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:bg-primary/90 active:scale-95"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
