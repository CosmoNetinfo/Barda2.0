import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Ottiene l'utente corrente per la gestione del profilo e consenso
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // Crea profilo se mancante
          await supabase.from('profiles').insert({
            id: user.id,
            name: user.user_metadata?.full_name || user.email || 'Membro',
            avatar_url: user.user_metadata?.avatar_url || null,
            role: 'membro',
            consent_accepted_at: new Date().toISOString()
          })
        } else {
          // Poiché l'accesso via Google richiede l'accettazione del checkbox,
          // salviamo il consenso per l'utente che ha appena effettuato l'accesso.
          await supabase
            .from('profiles')
            .update({ consent_accepted_at: new Date().toISOString() })
            .eq('id', user.id)
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?message=Authentication failed', request.url))
}

