'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Lightbulb, CheckSquare, Calendar, BarChart2, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function GlobalFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-50 flex flex-col items-end" ref={menuRef}>
      {/* Menu espanso */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <FabItem href="/ideas?new=1" icon={<Lightbulb size={20} />} label="Idea" color="bg-amber-500" />
        <FabItem href="/tasks?new=1" icon={<CheckSquare size={20} />} label="Task" color="bg-rose-500" />
        <FabItem href="/events?new=1" icon={<Calendar size={20} />} label="Evento" color="bg-primary" />
        <FabItem href="/polls?new=1" icon={<BarChart2 size={20} />} label="Sondaggio" color="bg-violet-500" />
        <FabItem href="/places?new=1" icon={<MapPin size={20} />} label="Luogo" color="bg-success" />
      </div>

      {/* Pulsante principale */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform active:scale-95"
      >
        <Plus size={30} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
    </div>
  )
}

function FabItem({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) {
  return (
    <Link href={href} className="flex items-center justify-end gap-3 group">
      <span className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700 shadow-md">
        {label}
      </span>
      <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg ${color}`}>
        {icon}
      </div>
    </Link>
  )
}
