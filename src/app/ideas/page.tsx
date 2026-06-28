/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Lightbulb } from 'lucide-react'
import IdeaForm from './components/IdeaForm'
import IdeaCard from './components/IdeaCard'

export default async function IdeasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch ideas, profiles, votes, comments, and comment likes
  const [
    { data: ideasRaw },
    { data: profiles },
    { data: myVotes },
    { data: allVotes },
    { data: commentsRaw },
    { data: commentLikesRaw }
  ] = await Promise.all([
    supabase.from('ideas').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, name, avatar_url'),
    supabase.from('idea_votes').select('idea_id, vote').eq('user_id', user.id),
    supabase.from('idea_votes').select('idea_id, vote'),
    supabase.from('idea_comments').select('*').order('created_at', { ascending: true }),
    supabase.from('idea_comment_likes').select('*')
  ])

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Map author profile to ideas
  const ideas = ideasRaw?.map(idea => ({
    ...idea,
    profiles: profileMap.get(idea.author_id) || null
  })) || []

  const myVoteMap = new Map(myVotes?.map(v => [v.idea_id, v.vote]))

  // Fetch current user's profile to check role
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Aggregate votes
  const voteCounts = new Map<string, { up: number, down: number }>()
  ideas?.forEach(idea => voteCounts.set(idea.id, { up: 0, down: 0 }))
  allVotes?.forEach(v => {
    const counts = voteCounts.get(v.idea_id)
    if (counts) {
      if (v.vote === 'up') counts.up++
      else if (v.vote === 'down') counts.down++
    }
  })

  // Group and format comments by idea_id
  const commentsByIdea = new Map<string, any[]>()
  ideas?.forEach(idea => commentsByIdea.set(idea.id, []))

  commentsRaw?.forEach(c => {
    const author = profileMap.get(c.user_id)
    const likes = commentLikesRaw?.filter(l => l.comment_id === c.id) || []
    const likesCount = likes.length
    const hasLiked = likes.some(l => l.user_id === user.id)

    const formattedComment = {
      id: c.id,
      body: c.body,
      created_at: c.created_at,
      user_id: c.user_id,
      authorName: author?.name || 'Utente sconosciuto',
      authorAvatar: author?.avatar_url || null,
      likesCount,
      hasLiked
    }

    const currentComments = commentsByIdea.get(c.idea_id) || []
    currentComments.push(formattedComment)
    commentsByIdea.set(c.idea_id, currentComments)
  })

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-3 border-b pb-4 border-gray-200">
        <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
          <Lightbulb size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Idee Contenuti</h1>
          <p className="text-gray-500">Proponi e vota le prossime stronzate da fare.</p>
        </div>
      </header>

      <IdeaForm />

      <div className="space-y-4">
        {ideas?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            Nessuna idea proposta finora. Sii il primo!
          </div>
        ) : (
          ideas?.map(idea => {
            const counts = voteCounts.get(idea.id) || { up: 0, down: 0 }
            const myVote = myVoteMap.get(idea.id) || null
            const isAuthor = idea.author_id === user.id
            const isAdmin = myProfile?.role?.toLowerCase() === 'admin'
            const canDelete = isAuthor || isAdmin
            const comments = commentsByIdea.get(idea.id) || []

            return (
              <IdeaCard
                key={idea.id}
                idea={idea}
                myVote={myVote}
                counts={counts}
                canDelete={canDelete}
                userId={user.id}
                isAdmin={isAdmin}
                comments={comments}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
