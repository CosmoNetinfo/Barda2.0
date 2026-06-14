'use client'

import { rsvpEvent } from '@/app/actions/events'
import { useTransition } from 'react'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

export default function EventRSVPButtons({ eventId, currentStatus }: { eventId: string, currentStatus: string | null }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className={`flex flex-wrap gap-2 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <button 
        onClick={() => startTransition(() => rsvpEvent(eventId, 'yes'))}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
          currentStatus === 'yes' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
        }`}
      >
        <CheckCircle2 size={18} className={currentStatus === 'yes' ? 'text-blue-200' : ''} />
        <span>Ci sono</span>
      </button>

      <button 
        onClick={() => startTransition(() => rsvpEvent(eventId, 'maybe'))}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
          currentStatus === 'maybe' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-500'
        }`}
      >
        <HelpCircle size={18} className={currentStatus === 'maybe' ? 'text-amber-200' : ''} />
        <span>Forse</span>
      </button>

      <button 
        onClick={() => startTransition(() => rsvpEvent(eventId, 'no'))}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
          currentStatus === 'no' ? 'bg-gray-200 text-gray-800 border-gray-300 shadow-inner' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <XCircle size={18} className={currentStatus === 'no' ? 'text-gray-500' : ''} />
        <span>Non posso</span>
      </button>
    </div>
  )
}
