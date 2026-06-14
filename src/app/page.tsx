import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import GroupActions from './components/GroupActions'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch groups the user belongs to
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">I Bardasci</h1>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="text-sm font-semibold text-red-600 hover:underline">
                Esci
              </button>
            </form>
          </div>
        </header>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">I tuoi Gruppi</h2>
          <GroupActions />
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
            Errore nel caricamento dei gruppi.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <div key={group.id} className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              {group.description && <p className="text-sm text-gray-500 mt-1">{group.description}</p>}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Codice: {group.invite_code}</span>
              </div>
            </div>
          ))}

          {(!groups || groups.length === 0) && !error && (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-gray-500">
              Non sei ancora in nessun gruppo. Creane uno nuovo o unisciti tramite codice di invito!
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
