/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import IdeaVoteButtons from './IdeaVoteButtons'
import IdeaDeleteButton from './IdeaDeleteButton'
import IdeaCommentsSection from './IdeaCommentsSection'

interface CommentType {
  id: string
  body: string
  created_at: string
  user_id: string
  authorName: string
  authorAvatar: string | null
  likesCount: number
  hasLiked: boolean
}

interface IdeaCardProps {
  idea: any
  myVote: 'up' | 'down' | null
  counts: { up: number; down: number }
  canDelete: boolean
  userId: string
  isAdmin: boolean
  comments: CommentType[]
}

export default function IdeaCard({
  idea,
  myVote,
  counts,
  canDelete,
  userId,
  isAdmin,
  comments
}: IdeaCardProps) {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false)

  const author = Array.isArray(idea.profiles) ? idea.profiles[0] : idea.profiles

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition overflow-hidden">
      
      {/* Contenuto Principale Card */}
      <div className="p-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
              {idea.category}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              idea.status === 'proposta' ? 'bg-blue-50 text-blue-600' :
              idea.status === 'approvata' ? 'bg-green-50 text-green-600' :
              idea.status === 'scartata' ? 'bg-red-50 text-red-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              {idea.status}
            </span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900">{idea.title}</h3>
            {idea.description && (
              <p className="text-gray-600 mt-1">{idea.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {author?.avatar_url ? (
              <img src={author.avatar_url} className="w-6 h-6 rounded-full object-cover border border-gray-100" alt="Author" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs border border-gray-300">
                {author?.name?.[0] || '?'}
              </div>
            )}
            <span className="font-medium text-gray-700">{author?.name || 'Utente sconosciuto'}</span>
            <span>•</span>
            <span>{new Date(idea.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Voto, Commenta, Elimina */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
          <IdeaVoteButtons 
            ideaId={idea.id} 
            currentVote={myVote} 
            upVotes={counts.up} 
            downVotes={counts.down} 
          />
          
          <div className="flex items-center gap-3 w-full justify-around sm:justify-start">
            <button
              onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
              className={`flex items-center gap-1.5 text-sm font-semibold transition py-1.5 px-2.5 rounded-xl border ${
                isCommentsExpanded
                  ? 'bg-gray-100 text-gray-900 border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-transparent'
              }`}
            >
              <MessageSquare size={16} />
              <span>Commenta ({comments.length})</span>
            </button>
            {canDelete && (
              <IdeaDeleteButton ideaId={idea.id} />
            )}
          </div>
        </div>
      </div>

      {/* Sezione Commenti Espandibile */}
      {isCommentsExpanded && (
        <IdeaCommentsSection 
          ideaId={idea.id} 
          comments={comments} 
          userId={userId} 
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}
