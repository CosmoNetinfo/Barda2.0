'use client'

import { voteIdea } from '@/app/actions/ideas'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useTransition } from 'react'

export default function IdeaVoteButtons({ ideaId, currentVote, upVotes, downVotes }: { ideaId: string, currentVote: string | null, upVotes: number, downVotes: number }) {
  const [isPending, startTransition] = useTransition()

  const handleVote = (type: 'up' | 'down') => {
    startTransition(() => { voteIdea(ideaId, type) })
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 border border-gray-200">
      <button 
        disabled={isPending}
        onClick={() => handleVote('up')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${currentVote === 'up' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-green-600 hover:bg-gray-200'}`}
      >
        <ThumbsUp size={16} className={currentVote === 'up' ? 'fill-green-600' : ''} />
        <span>{upVotes}</span>
      </button>
      <div className="w-px h-4 bg-gray-300"></div>
      <button 
        disabled={isPending}
        onClick={() => handleVote('down')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${currentVote === 'down' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-red-600 hover:bg-gray-200'}`}
      >
        <ThumbsDown size={16} className={currentVote === 'down' ? 'fill-red-600' : ''} />
        <span>{downVotes}</span>
      </button>
    </div>
  )
}
