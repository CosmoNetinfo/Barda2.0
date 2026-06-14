'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Lightbulb, CheckSquare, Calendar, Menu, BarChart2, MapPin, Users, User, X } from 'lucide-react'
import { useState } from 'react'

export default function GlobalMobileNav({ role = 'user' }: { role?: string }) {
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const handleClose = () => {
    console.log('>>> DEBUG: Chiusura menu Altro')
    setIsMoreOpen(false)
  }

  return (
    <>
      {/* Overlay menu "Altro" */}
      {isMoreOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        >
          <div 
            className="absolute bottom-24 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900">Altre Sezioni</h3>
              <button 
                onClick={() => {
                  alert("DEBUG: Click su X per chiudere!");
                  handleClose();
                }} 
                className="p-3 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MoreItem href="/polls" icon={<BarChart2 size={28} className="text-violet-500" />} label="Sondaggi" onClose={handleClose} />
              <MoreItem href="/places" icon={<MapPin size={28} className="text-emerald-500" />} label="Luoghi" onClose={handleClose} />
              <MoreItem href="/members" icon={<Users size={28} className="text-indigo-500" />} label="Membri" onClose={handleClose} />
              <MoreItem href="/profile" icon={<User size={28} className="text-blue-500" />} label="Profilo" onClose={handleClose} />
              {role === 'founder' && (
                <MoreItem href="/admin/debug" icon={<BarChart2 size={28} className="text-rose-500" />} label="Debug" onClose={handleClose} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-gradient-to-r from-success to-emerald-500 flex justify-around p-2 z-[110] pb-safe shadow-[0_-10px_30px_-15px_rgba(46,139,58,0.5)]">
        <NavItem href="/" icon={<Home size={24} />} label="Home" active={pathname === '/'} />
        <NavItem href="/ideas" icon={<Lightbulb size={24} />} label="Idee" active={pathname === '/ideas'} />
        <NavItem href="/tasks" icon={<CheckSquare size={24} />} label="Task" active={pathname === '/tasks'} />
        <NavItem href="/events" icon={<Calendar size={24} />} label="Eventi" active={pathname === '/events'} />
        
        <button 
          onClick={() => {
            console.log('>>> DEBUG: Apertura menu Altro')
            setIsMoreOpen(true)
          }}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all ${
            isMoreOpen ? 'text-white scale-110' : 'text-emerald-100/80 hover:text-white'
          }`}
        >
          <div className={`${isMoreOpen ? 'bg-white/20 p-1.5 rounded-full shadow-sm' : 'p-1.5'}`}>
            <Menu size={24} />
          </div>
          <span className="text-[10px] font-bold">Altro ✨</span>
        </button>
      </nav>
    </>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-xl transition-all ${
        active ? 'text-white scale-110' : 'text-emerald-100/80 hover:text-white'
      }`}
    >
      <div className={`${active ? 'bg-white/20 p-1.5 rounded-full shadow-sm' : 'p-1.5'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  )
}

function MoreItem({ href, icon, label, onClose }: { href: string, icon: React.ReactNode, label: string, onClose: () => void }) {
  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault()
        alert(`>>> DEBUG VISIVO: Hai cliccato su ${label}. Sto forzando il caricamento di ${href}`)
        console.log(`>>> DEBUG: Click su ${label} (${href})`)
        
        // Forzatura bruta del browser
        window.location.href = href
        
        // Chiudiamo il menu con un minimo di ritardo per non distruggere il tag <a> mentre naviga
        setTimeout(() => {
          onClose()
        }, 300)
      }} 
      className="flex w-full flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all border-none focus:outline-none cursor-pointer"
    >
      <div className="bg-white p-3 rounded-full shadow-sm pointer-events-none">
        {icon}
      </div>
      <span className="font-bold text-sm text-gray-700 pointer-events-none">{label}</span>
    </a>
  )
}
