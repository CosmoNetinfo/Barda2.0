import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import IdeaActions from './IdeaActions'

export default async function GroupPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Otteniamo il gruppo
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('*')
    .eq('id', params.id)
    .single()

  if (groupError || !group) {
    return <div className="p-8 text-center text-red-600">Gruppo non trovato o accesso negato.</div>
  }

  // Otteniamo le idee e i relativi voti
  const { data: ideas, error: ideasError } = await supabase
    .from('ideas')
    .select(`
      *,
      author:author_id(email),
      votes:idea_votes(user_id, vote)
    `)
    .eq('group_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Gruppo */}
        <header className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black">
              &larr; Torna ai Gruppi
            </Link>
          </div>
          {group.description && <p className="text-gray-600">{group.description}</p>}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-gray-100 px-3 py-1">
              Codice Invito: <strong className="text-black">{group.invite_code}</strong>
            </span>
          </div>
        </header>

        {/* Tab di navigazione (per ora c'è solo la bacheca idee) */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <div className="border-b-2 border-black pb-2 text-sm font-semibold text-black">
            💡 Bacheca Idee
          </div>
          <div className="pb-2 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed">
            📅 Eventi (v0.3)
          </div>
          <div className="pb-2 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed">
            ✅ Task (v0.5)
          </div>
        </div>

        {/* Client component per creare e gestire le idee */}
        <IdeaActions groupId={group.id} ideas={ideas || []} currentUserId={user.id} />
        
      </div>
    </main>
  )
}
