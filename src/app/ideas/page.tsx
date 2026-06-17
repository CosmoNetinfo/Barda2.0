import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Lightbulb, MessageSquare } from 'lucide-react'
import IdeaForm from './components/IdeaForm'
import IdeaVoteButtons from './components/IdeaVoteButtons'

export default async function IdeasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch ideas
  const { data: ideasRaw } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Map author profile to ideas
  const ideas = ideasRaw?.map(idea => ({
    ...idea,
    profiles: profileMap.get(idea.author_id) || null
  })) || []

  // Fetch votes for this user
  const { data: myVotes } = await supabase
    .from('idea_votes')
    .select('idea_id, vote')
    .eq('user_id', user.id)

  const myVoteMap = new Map(myVotes?.map(v => [v.idea_id, v.vote]))

  // In a real app we'd do an aggregate query, but we can aggregate votes here for demo
  const { data: allVotes } = await supabase
    .from('idea_votes')
    .select('idea_id, vote')

  const voteCounts = new Map<string, { up: number, down: number }>()
  ideas?.forEach(idea => voteCounts.set(idea.id, { up: 0, down: 0 }))
  allVotes?.forEach(v => {
    const counts = voteCounts.get(v.idea_id)
    if (counts) {
      if (v.vote === 'up') counts.up++
      else if (v.vote === 'down') counts.down++
    }
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
            const author = Array.isArray(idea.profiles) ? idea.profiles[0] : idea.profiles;

            return (
              <div key={idea.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 hover:shadow-md transition">
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
                      <img src={author.avatar_url} className="w-6 h-6 rounded-full" alt="Author" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                        {author?.name?.[0] || '?'}
                      </div>
                    )}
                    <span className="font-medium text-gray-700">{author?.name || 'Utente sconosciuto'}</span>
                    <span>•</span>
                    <span>{new Date(idea.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-4">
                  <IdeaVoteButtons 
                    ideaId={idea.id} 
                    currentVote={myVote} 
                    upVotes={counts.up} 
                    downVotes={counts.down} 
                  />
                  
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium transition">
                    <MessageSquare size={16} />
                    <span>Commenta</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
