import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Info } from 'lucide-react'
import CopyLinkButton from './components/CopyLinkButton'
import RoleEditor from './components/RoleEditor'

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
    .order('created_at', { ascending: true })

  const currentUserProfile = profiles?.find(p => p.id === user.id)
  const isAdmin = currentUserProfile?.role === 'admin'
  const isOnlyMember = profiles?.length === 1

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

      {/* Banner Informativo */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full h-fit">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-lg">Come invitare i membri?</h3>
            <p className="text-indigo-700 mt-1 leading-relaxed">
              I membri appaiono automaticamente dopo il loro primo accesso con l&apos;account Google. Condividi il link dell&apos;app sul gruppo WhatsApp dei Bardasci per aggiungerli alla squadra.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <CopyLinkButton />
        </div>
      </div>

      {isOnlyMember ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 flex flex-col items-center">
          <Users size={64} className="text-gray-300 mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Sei il primo! 🎉</h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Ancora nessun altro membro si è unito all&apos;app. Sei tu l&apos;apripista! Condividi il link per invitare gli altri Bardasci a fare il login.
          </p>
          <CopyLinkButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles?.map(profile => {
            const isMe = profile.id === user.id
            const joinDate = new Date(profile.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
            
            return (
              <div key={profile.id} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
                {isMe && (
                  <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Tu
                  </div>
                )}
                
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-24 h-24 rounded-full mb-4 shadow-sm border-4 border-white" />
                ) : (
                  <div className="w-24 h-24 rounded-full mb-4 shadow-sm border-4 border-white bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
                    {profile.name[0]}
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
                
                {isAdmin && !isMe ? (
                  <div className="mb-4">
                    <RoleEditor userId={profile.id} initialRole={profile.role || 'ospite'} />
                  </div>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full mb-4 inline-block">
                    {profile.role || 'ospite'}
                  </span>
                )}

                <p className="text-xs text-gray-400 font-medium mt-auto pt-4 border-t border-gray-50 w-full">
                  Membro da {joinDate}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
