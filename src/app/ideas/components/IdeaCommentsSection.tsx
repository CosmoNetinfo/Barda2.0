/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addComment, deleteComment, toggleCommentLike } from '@/app/actions/ideas'
import { Send, ThumbsUp, Trash2, MessageSquare } from 'lucide-react'

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

interface IdeaCommentsSectionProps {
  ideaId: string
  comments: CommentType[]
  userId: string
  isAdmin: boolean
}

export default function IdeaCommentsSection({ ideaId, comments, userId, isAdmin }: IdeaCommentsSectionProps) {
  const [newCommentText, setNewCommentText] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim() || isPending) return

    const text = newCommentText.trim()
    setNewCommentText('')

    startTransition(async () => {
      const res = await addComment(ideaId, text)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo commento?')) return

    startTransition(async () => {
      const res = await deleteComment(commentId)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }
    })
  }

  const handleToggleLike = (commentId: string) => {
    startTransition(async () => {
      const res = await toggleCommentLike(commentId)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-gray-50 border-t border-gray-100 p-4 md:p-6 rounded-b-2xl space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
        <MessageSquare size={14} />
        <span>Commenti ({comments.length})</span>
      </div>

      {/* Lista Commenti */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Nessun commento ancora. Scrivi qualcosa tu!</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {comments.map((comment) => {
            const canDelete = comment.user_id === userId || isAdmin
            return (
              <div key={comment.id} className="flex gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm relative group hover:border-gray-200 transition">
                {/* Avatar */}
                {comment.authorAvatar ? (
                  <img src={comment.authorAvatar} className="w-8 h-8 rounded-full object-cover mt-0.5 border border-gray-100" alt="Avatar" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs mt-0.5 border border-gray-300">
                    {comment.authorName[0]?.toUpperCase() || '?'}
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 space-y-1 pr-6">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-bold text-gray-900">{comment.authorName}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{comment.body}</p>

                  {/* Likes del commento */}
                  <div className="flex items-center gap-2 pt-1.5">
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      disabled={isPending}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        comment.hasLiked
                          ? 'bg-[#E8201A]/10 text-[#E8201A] border-[#E8201A]/20 shadow-sm'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ThumbsUp size={12} className={comment.hasLiked ? 'fill-current' : ''} />
                      <span>{comment.likesCount} {comment.likesCount === 1 ? 'Like' : 'Likes'}</span>
                    </button>
                  </div>
                </div>

                {/* Tasto elimina */}
                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isPending}
                    className="absolute top-3.5 right-3.5 text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                    title="Elimina commento"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Form di inserimento commento */}
      <form onSubmit={handleAddComment} className="flex gap-2 pt-2 items-center">
        <input
          type="text"
          placeholder="Scrivi un commento..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          disabled={isPending}
          className="flex-1 min-h-[44px] rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E8201A] focus:outline-none transition shadow-inner"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim() || isPending}
          className={`h-11 w-11 flex items-center justify-center rounded-xl text-white transition-all shadow-md ${
            !newCommentText.trim() || isPending
              ? 'bg-gray-300 opacity-60 cursor-not-allowed'
              : 'bg-[#E8201A] hover:bg-[#d11913] active:scale-95'
          }`}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
