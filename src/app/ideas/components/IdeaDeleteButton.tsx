'use client'

import { deleteIdea } from '@/app/actions/ideas'
import { Trash2, Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function IdeaDeleteButton({ ideaId }: { ideaId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare questa idea?')) {
      startTransition(async () => {
        const res = await deleteIdea(ideaId)
        if (res && res.error) {
          alert(res.error)
        } else {
          router.refresh()
        }
      })
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center justify-center gap-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 p-2 rounded-xl border border-gray-200/60 transition-all min-w-[38px] min-h-[38px] disabled:opacity-50"
      title="Elimina Idea"
    >
      {isPending ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
    </button>
  )
}
