import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'

export default async function MembersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 text-white p-4 rounded-3xl shadow-lg shadow-indigo-200">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">I Bardasci</h1>
            <p className="text-gray-500 font-medium mt-1">La nostra fantastica squadra.</p>
          </div>
        </div>
      </header>

      {profiles?.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Nessun membro trovato</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles?.map(profile => (
            <div key={profile.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full mb-4 shadow-sm border-4 border-white" />
              ) : (
                <div className="w-24 h-24 rounded-full mb-4 shadow-sm border-4 border-white bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
                  {profile.name[0]}
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full mt-2">
                {profile.role || 'Membro'}
              </span>
              
              {profile.bio && (
                <p className="text-sm text-gray-500 mt-4 leading-relaxed line-clamp-3">
                  {profile.bio}
                </p>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
