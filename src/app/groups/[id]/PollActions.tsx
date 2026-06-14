'use client'

import { useState } from 'react'
import { createPoll, votePoll } from '../../actions/polls'

type PollOption = {
  id: string
  label: string
  poll_id: string
}

type PollVote = {
  option_id: string
  user_id: string
}

type Poll = {
  id: string
  question: string
  type: string
  author: { email: string }
  options: PollOption[]
  votes: PollVote[]
}

export default function PollActions({ groupId, polls, currentUserId }: { groupId: string, polls: Poll[], currentUserId: string }) {
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('groupId', groupId)
    const res = await createPoll(formData)
    if (res?.error) setError(res.error)
    else setIsCreating(false)
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sondaggi</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Nuovo Sondaggio
        </button>
      </div>

      {isCreating && (
        <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Crea un Sondaggio</h3>
          <div className="mb-4">
            <label htmlFor="question" className="mb-1 block text-sm font-medium">Domanda</label>
            <input id="question" name="question" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Dove andiamo a cena?" />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="mb-1 block text-sm font-medium">Tipo di Scelta</label>
            <select id="type" name="type" className="w-full rounded-md border p-2 text-sm bg-white">
              <option value="single">Scelta Singola (es. votazione)</option>
              <option value="multi">Scelta Multipla (es. date disponibili tipo Doodle)</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="options" className="mb-1 block text-sm font-medium">Opzioni (separate da virgola)</label>
            <input id="options" name="options" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Pizzeria, Sushi, Hamburger" />
            <p className="text-xs text-gray-500 mt-1">Inserisci le opzioni separandole con una virgola.</p>
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
            <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Crea Sondaggio</button>
          </div>
        </form>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {polls.map((poll) => {
          // Calcolo totale voti
          const totalVotes = poll.votes?.length || 0
          
          return (
            <div key={poll.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                  {poll.type === 'multi' ? 'Scelta Multipla' : 'Scelta Singola'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{poll.question}</h3>
                <p className="text-xs text-gray-400 mt-1">Creato da {poll.author?.email?.split('@')[0]}</p>
              </div>

              <div className="space-y-3">
                {poll.options?.map((option) => {
                  const optionVotes = poll.votes?.filter(v => v.option_id === option.id) || []
                  const voteCount = optionVotes.length
                  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
                  const hasVotedThis = optionVotes.some(v => v.user_id === currentUserId)

                  return (
                    <div 
                      key={option.id} 
                      onClick={() => votePoll(poll.id, option.id, groupId, poll.type === 'multi')}
                      className={`relative overflow-hidden rounded-md border p-3 cursor-pointer transition-colors ${hasVotedThis ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300'}`}
                    >
                      {/* Barra di progresso sfondo */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-indigo-100/50 transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                      
                      <div className="relative flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 border flex items-center justify-center ${poll.type === 'multi' ? 'rounded-sm' : 'rounded-full'} ${hasVotedThis ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                            {hasVotedThis && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${hasVotedThis ? 'text-indigo-900' : 'text-gray-700'}`}>{option.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {voteCount} ({percentage}%)
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {polls.length === 0 && !isCreating && (
          <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-gray-500">
            Nessun sondaggio attivo al momento.
          </div>
        )}
      </div>
    </div>
  )
}
