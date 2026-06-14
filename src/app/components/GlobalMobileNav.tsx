'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Lightbulb, CheckSquare, Calendar, Menu, BarChart2, MapPin, Users, User, X } from 'lucide-react'
import { useState } from 'react'

export default function GlobalMobileNav({ role = 'user' }: { role?: string }) {
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  return (
    <>
      {/* Overlay menu "Altro" */}
      {isMoreOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMoreOpen(false)}
        >
          <div 
            className="absolute bottom-20 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900">Altre Sezioni</h3>
              <button onClick={() => setIsMoreOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MoreItem href="/polls" icon={<BarChart2 size={28} className="text-violet-500" />} label="Sondaggi" onClick={() => setIsMoreOpen(false)} />
              <MoreItem href="/places" icon={<MapPin size={28} className="text-emerald-500" />} label="Luoghi" onClick={() => setIsMoreOpen(false)} />
              <MoreItem href="/members" icon={<Users size={28} className="text-indigo-500" />} label="Membri" onClick={() => setIsMoreOpen(false)} />
              <MoreItem href="/profile" icon={<User size={28} className="text-blue-500" />} label="Profilo" onClick={() => setIsMoreOpen(false)} />
              {role === 'founder' && (
                <MoreItem href="/admin/debug" icon={<BarChart2 size={28} className="text-rose-500" />} label="Debug" onClick={() => setIsMoreOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 pb-safe">
        <NavItem href="/" icon={<Home size={24} />} label="Home" active={pathname === '/'} />
        <NavItem href="/ideas" icon={<Lightbulb size={24} />} label="Idee" active={pathname === '/ideas'} />
        <NavItem href="/tasks" icon={<CheckSquare size={24} />} label="Task" active={pathname === '/tasks'} />
        <NavItem href="/events" icon={<Calendar size={24} />} label="Eventi" active={pathname === '/events'} />
        
        <button 
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            isMoreOpen ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Menu size={24} />
          <span className="text-[10px] font-bold mt-0.5">Altro</span>
        </button>
      </nav>
    </>
  )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
        active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      <div className={`${active ? 'bg-gray-100 p-1.5 rounded-full' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold mt-0.5 ${active ? 'text-gray-900' : ''}`}>{label}</span>
    </Link>
  )
}

function MoreItem({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all">
      <div className="bg-white p-3 rounded-full shadow-sm">
        {icon}
      </div>
      <span className="font-bold text-sm text-gray-700">{label}</span>
    </Link>
  )
}
