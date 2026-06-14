import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart2 } from 'lucide-react'
import PollForm from './components/PollForm'
import PollItem from './components/PollItem'

export default async function PollsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch polls
  const { data: polls } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch options
  const { data: options } = await supabase
    .from('poll_options')
    .select('*')

  // Fetch votes
  const { data: votes } = await supabase
    .from('poll_votes')
    .select('*')

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white p-4 rounded-3xl shadow-lg shadow-violet-200">
            <BarChart2 size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Sondaggi</h1>
            <p className="text-gray-500 font-medium mt-1">Prendiamo decisioni democraticamente.</p>
          </div>
        </div>
        
        <div className="w-full md:w-80">
          <PollForm />
        </div>
      </header>

      {polls?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
          <BarChart2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Nessun sondaggio attivo</h3>
          <p className="mt-1">Crea il primo sondaggio per chiedere l&apos;opinione del gruppo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls?.map(poll => {
            const pollOptions = options?.filter(o => o.poll_id === poll.id) || []
            const pollVotes = votes?.filter(v => v.poll_id === poll.id) || []

            return (
              <PollItem 
                key={poll.id} 
                poll={poll} 
                options={pollOptions} 
                votes={pollVotes} 
                currentUserId={user.id} 
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
