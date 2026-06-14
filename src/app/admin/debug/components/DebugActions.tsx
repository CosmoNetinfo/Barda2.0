'use client'

import { useState, useTransition } from 'react'
import { forceRevalidate, clearActivityLog } from '@/app/actions/debug'
import { RefreshCw, Trash2, Loader2, ServerCrash } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DebugActions() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRevalidate = () => {
    startTransition(async () => {
      await forceRevalidate()
      router.refresh()
    })
  }

  const handleClearLog = () => {
    if (confirm('Sei sicuro di voler svuotare tutto il registro attività?')) {
      startTransition(async () => {
        await clearActivityLog()
        router.refresh()
      })
    }
  }

  return (
    <div className="flex gap-4">
      <button 
        onClick={handleRevalidate} 
        disabled={isPending}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        Forza Revalidate Cache
      </button>
      <button 
        onClick={handleClearLog}
        disabled={isPending}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        Svuota Activity Log
      </button>
    </div>
  )
}
