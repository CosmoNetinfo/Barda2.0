'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, X } from 'lucide-react'

export default function PwaInstallBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if app is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    // Also check localStorage so we don't annoy the user if they dismissed it
    const dismissed = localStorage.getItem('bardo_pwa_banner_dismissed')

    if (!isStandalone && !dismissed) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  const handleDismiss = () => {
    localStorage.setItem('bardo_pwa_banner_dismissed', 'true')
    setShow(false)
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="absolute top-0 right-0 opacity-10 p-4">
        <Download size={80} />
      </div>
      
      <div className="relative z-10">
        <h3 className="font-barlow font-bold text-xl uppercase tracking-wider mb-1">Installa l&apos;App di Bardò</h3>
        <p className="text-red-100 text-sm font-medium">Aggiungi Bardò alla tua home per un&apos;esperienza migliore e più veloce.</p>
      </div>

      <div className="relative z-10 flex w-full sm:w-auto items-center gap-3">
        <Link 
          href="/install" 
          className="flex-1 sm:flex-none bg-white text-red-600 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-xl text-center transition-colors"
        >
          Scopri come
        </Link>
        <button 
          onClick={handleDismiss}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
