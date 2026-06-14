'use client'

import { useState, useEffect } from 'react'
import { Facebook, X } from 'lucide-react'

export default function FacebookBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already followed or dismissed
    const hasFollowed = localStorage.getItem('fb_cosmonet_followed')
    const hasDismissed = localStorage.getItem('fb_cosmonet_dismissed')

    if (!hasFollowed && !hasDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleFollowClick = () => {
    localStorage.setItem('fb_cosmonet_followed', 'true')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('fb_cosmonet_dismissed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden mb-8">
      {/* Background decoration */}
      <Facebook size={120} className="absolute -right-6 -bottom-6 text-white opacity-10 pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10 w-full">
        <div className="bg-white p-3 rounded-full shrink-0 shadow-sm hidden sm:block">
          <Facebook className="text-blue-600" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-bold text-lg sm:text-xl">Supporta il progetto!</h3>
            <button onClick={handleDismiss} className="sm:hidden text-white/70 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1 max-w-md">
            Segui la pagina ufficiale di <strong>Cosmonet</strong> su Facebook per rimanere sempre aggiornato.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto relative z-10 shrink-0">
        <a 
          href="https://www.facebook.com/profile.php?id=61582734096140" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleFollowClick}
          className="flex-1 sm:flex-none bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all text-center whitespace-nowrap"
        >
          Segui la Pagina
        </a>
        <button 
          onClick={handleDismiss} 
          className="hidden sm:flex p-3 rounded-xl text-blue-100 hover:bg-white/10 transition-colors"
          title="Chiudi"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
