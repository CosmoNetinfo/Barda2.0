'use client'

import { votePoll } from '@/app/actions/polls'
import { useTransition } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PollItem({ poll, options, votes, currentUserId }: { poll: any, options: any[], votes: any[], currentUserId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleVote = (optionId: string) => {
    startTransition(() => votePoll(poll.id, optionId, poll.type === 'multi'))
  }

  const totalVotes = votes.length

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">
          {poll.type === 'multi' ? 'Scelta Multipla' : 'Scelta Singola'}
        </span>
        {poll.expires_at && (
          <span className="text-xs font-semibold text-gray-400">
            Scade: {new Date(poll.expires_at).toLocaleDateString('it-IT')}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-6">{poll.question}</h3>

      <div className={`space-y-3 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        {options.map(option => {
          const optionVotes = votes.filter(v => v.option_id === option.id)
          const percentage = totalVotes > 0 ? Math.round((optionVotes.length / totalVotes) * 100) : 0
          const hasMyVote = optionVotes.some(v => v.user_id === currentUserId)

          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => handleVote(option.id)}
                className={`w-full relative z-10 text-left px-4 py-3 rounded-xl border transition-all flex justify-between items-center ${
                  hasMyVote ? 'border-violet-500 bg-violet-50/50' : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                }`}
              >
                <span className={`font-semibold ${hasMyVote ? 'text-violet-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                <span className={`text-sm font-bold ${hasMyVote ? 'text-violet-600' : 'text-gray-500'}`}>
                  {percentage}% ({optionVotes.length})
                </span>
              </button>
              {/* Progress bar background */}
              <div 
                className={`absolute inset-0 rounded-xl ${hasMyVote ? 'bg-violet-100' : 'bg-gray-100'} transition-all`}
                style={{ width: `${percentage}%`, opacity: 0.5 }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
