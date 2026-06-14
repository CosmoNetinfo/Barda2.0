'use client'

import { useState } from 'react'
import { createIdea, voteIdea, updateIdeaStatus } from '../../actions/ideas'

type Idea = {
  id: string
  title: string
  body: string
  status: string
  created_at: string
  author: { email: string }
  votes: { user_id: string, vote: string }[]
}

export default function IdeaActions({ groupId, ideas, currentUserId }: { groupId: string, ideas: Idea[], currentUserId: string }) {
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('groupId', groupId)
    const res = await createIdea(formData)
    if (res?.error) setError(res.error)
    else setIsCreating(false)
    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    proposta: 'bg-blue-100 text-blue-800',
    approvata: 'bg-green-100 text-green-800',
    scartata: 'bg-red-100 text-red-800',
    realizzata: 'bg-purple-100 text-purple-800',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Idee</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          + Proponi Idea
        </button>
      </div>

      {isCreating && (
        <form action={handleCreate} className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Nuova Idea</h3>
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium">Titolo</label>
            <input id="title" name="title" required className="w-full rounded-md border p-2 text-sm" placeholder="Es. Cena a base di sushi" />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="mb-1 block text-sm font-medium">Descrizione (Opzionale)</label>
            <textarea id="body" name="body" rows={3} className="w-full rounded-md border p-2 text-sm" placeholder="Dettagli dell'idea..." />
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Annulla</button>
            <button type="submit" disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Proponi</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {ideas.map((idea) => {
          const upvotes = idea.votes.filter(v => v.vote === '+1').length
          const downvotes = idea.votes.filter(v => v.vote === '-1').length
          const hearts = idea.votes.filter(v => v.vote === 'heart').length
          const myVote = idea.votes.find(v => v.user_id === currentUserId)?.vote

          return (
            <div key={idea.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{idea.title}</h3>
                  <p className="text-xs text-gray-500">Proposta da {idea.author.email.split('@')[0]} il {new Date(idea.created_at).toLocaleDateString()}</p>
                </div>
                
                {/* Status Dropdown (Solo per admin? Per ora aperto a tutti nel gruppo) */}
                <select 
                  value={idea.status}
                  onChange={(e) => updateIdeaStatus(idea.id, groupId, e.target.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold appearance-none border-none cursor-pointer ${statusColors[idea.status] || 'bg-gray-100 text-gray-800'}`}
                >
                  <option value="proposta">Proposta</option>
                  <option value="approvata">Approvata</option>
                  <option value="realizzata">Realizzata</option>
                  <option value="scartata">Scartata</option>
                </select>
              </div>

              {idea.body && <p className="mt-4 text-gray-700">{idea.body}</p>}

              <div className="mt-6 flex items-center gap-2">
                <button 
                  onClick={() => voteIdea(idea.id, groupId, '+1')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium border ${myVote === '+1' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  👍 {upvotes > 0 && upvotes}
                </button>
                <button 
                  onClick={() => voteIdea(idea.id, groupId, '-1')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium border ${myVote === '-1' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  👎 {downvotes > 0 && downvotes}
                </button>
                <button 
                  onClick={() => voteIdea(idea.id, groupId, 'heart')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium border ${myVote === 'heart' ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  ❤️ {hearts > 0 && hearts}
                </button>
              </div>
            </div>
          )
        })}

        {ideas.length === 0 && !isCreating && (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            Nessuna idea proposta finora. Sii il primo a proporne una!
          </div>
        )}
      </div>
    </div>
  )
}
