'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, CheckSquare, Lightbulb, MapPin, Users, BarChart2, User } from 'lucide-react'

export default function DesktopSidebar({ role = 'user' }: { role?: string }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-gradient-to-b from-success to-emerald-600 shadow-2xl z-50">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="bg-white p-1.5 rounded-xl shadow-sm">
          <img src="/bardasci-logo.png" alt="Logo" className="h-10 object-contain" />
        </div>
        <span className="font-barlow font-extrabold text-3xl tracking-tight text-white drop-shadow-sm">Bardà</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-3 overflow-y-auto pb-6 custom-scrollbar">
        <NavItem href="/" icon={<Home size={22} />} label="Home" active={pathname === '/'} />
        <NavItem href="/events" icon={<Calendar size={22} />} label="Eventi" active={pathname?.startsWith('/events')} />
        <NavItem href="/tasks" icon={<CheckSquare size={22} />} label="Task" active={pathname?.startsWith('/tasks')} />
        <NavItem href="/ideas" icon={<Lightbulb size={22} />} label="Idee" active={pathname?.startsWith('/ideas')} />
        <NavItem href="/polls" icon={<BarChart2 size={22} />} label="Sondaggi" active={pathname?.startsWith('/polls')} />
        <NavItem href="/places" icon={<MapPin size={22} />} label="Luoghi" active={pathname?.startsWith('/places')} />
        <NavItem href="/members" icon={<Users size={22} />} label="Membri" active={pathname?.startsWith('/members')} />
        <NavItem href="/profile" icon={<User size={22} />} label="Profilo" active={pathname?.startsWith('/profile')} />
        
        {role === 'founder' && (
          <div className="pt-4 mt-4 border-t border-white/20">
            <NavItem href="/admin/debug" icon={<BarChart2 size={22} />} label="Debug" active={pathname?.startsWith('/admin')} isDebug />
          </div>
        )}
      </nav>

      <div className="p-4 text-center border-t border-white/20 mt-auto">
        <Link href="/privacy" className="text-xs text-white/60 hover:text-white transition-colors block mb-2 underline">
          Privacy Policy
        </Link>
        <p className="text-[10px] text-white/60 font-medium">
          Sviluppato con ❤️ da<br/>
          <a href="https://cosmonet.info" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-emerald-200 transition-colors">
            Daniele Spalletti di CosmoNet.info
          </a>
        </p>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active, isDebug }: { href: string; icon: React.ReactNode; label: string; active?: boolean; isDebug?: boolean }) {
  if (active) {
    return (
      <Link href={href} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all shadow-md bg-white text-emerald-700 font-bold scale-105">
        <div className={isDebug ? "text-rose-500" : "text-emerald-500"}>
          {icon}
        </div>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border border-white/10 bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] font-medium shadow-sm">
      <div className="opacity-80">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  )
}
