import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Helper to parse .env.local manually without external dependencies
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('File .env.local non trovato!')
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf8')
  const env: Record<string, string> = {}
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const firstEq = trimmed.indexOf('=')
    if (firstEq === -1) return
    const key = trimmed.substring(0, firstEq).trim()
    const val = trimmed.substring(firstEq + 1).trim().replace(/^['"]|['"]$/g, '')
    env[key] = val
  })
  return env
}

async function runTests() {
  console.log('=== AVVIO TEST FUNZIONALE DEL BACKEND (SUPABASE) ===\n')
  const env = loadEnv()
  
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    console.error('Errore: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY mancanti in .env.local')
    process.exit(1)
  }

  console.log('Supabase URL:', url)
  console.log('Service Key presente:', serviceKey ? 'SÌ' : 'NO')

  // Client con credenziali standard (simula un utente loggato o anonimo)
  const client = createClient(url, anonKey)
  // Client con service role (simula le server action privilegiate/admin)
  const adminClient = serviceKey ? createClient(url, serviceKey) : null

  // 1. Verifica Profili
  console.log('\n[1] TEST PROFILI...')
  const { data: profiles, error: profError } = await client.from('profiles').select('id, name, role').limit(5)
  if (profError) {
    console.error('❌ Errore caricamento profili:', profError.message)
  } else {
    console.log(`✅ Successo! Caricati ${profiles?.length || 0} profili.`)
    if (profiles && profiles.length > 0) {
      console.log('Esempio profilo:', profiles[0])
    }
  }

  // Seleziona un utente di test
  const testUser = profiles?.[0]
  if (!testUser) {
    console.error('❌ Nessun profilo presente nel database per condurre i test.')
    return
  }

  // 2. Test Eventi & RSVP
  console.log('\n[2] TEST EVENTI & RSVP...')
  if (!adminClient) {
    console.log('⚠️ Salto test di scrittura perché manca SUPABASE_SERVICE_ROLE_KEY localmente.')
  } else {
    // Crea evento di test
    const { data: testEvent, error: eventError } = await adminClient.from('events').insert({
      author_id: testUser.id,
      title: 'Evento di Test Automato',
      date: '2026-12-31',
      time: '18:00',
      location: 'Laboratorio Test'
    }).select().single()

    if (eventError) {
      console.error('❌ Errore creazione evento di test:', eventError.message)
    } else {
      console.log('✅ Evento creato con successo! ID:', testEvent.id)

      // Inserimento RSVP
      const { error: rsvpError } = await adminClient.from('event_rsvp').insert({
        event_id: testEvent.id,
        user_id: testUser.id,
        status: 'maybe'
      })

      if (rsvpError) {
        console.error('❌ Errore inserimento RSVP:', rsvpError.message)
      } else {
        console.log('✅ Inserimento RSVP (Forse) riuscito!')

        // Modifica RSVP
        const { error: rsvpUpdateError } = await adminClient.from('event_rsvp').update({
          status: 'yes'
        }).eq('event_id', testEvent.id).eq('user_id', testUser.id)

        if (rsvpUpdateError) {
          console.error('❌ Errore aggiornamento RSVP:', rsvpUpdateError.message)
        } else {
          console.log('✅ Aggiornamento RSVP (Ci sono) riuscito!')

          // Seleziona RSVP per verificare la lettura
          const { data: fetchedRsvp, error: rsvpFetchError } = await adminClient
            .from('event_rsvp')
            .select('*')
            .eq('event_id', testEvent.id)

          if (rsvpFetchError) {
            console.error('❌ Errore lettura RSVP:', rsvpFetchError.message)
          } else {
            console.log(`✅ Lettura RSVP riuscita! Righe trovate: ${fetchedRsvp?.length || 0}`)
            if (fetchedRsvp?.[0]?.status === 'yes') {
              console.log('✅ Risultato corretto: Lo stato è "yes"')
            } else {
              console.error('❌ Risultato errato: Stato non corrispondente', fetchedRsvp?.[0])
            }
          }
        }
      }

      // Cleanup evento e RSVP (ON DELETE CASCADE)
      const { error: deleteError } = await adminClient.from('events').delete().eq('id', testEvent.id)
      if (deleteError) {
        console.error('❌ Errore durante il cleanup dell\'evento:', deleteError.message)
      } else {
        console.log('✅ Cleanup dell\'evento e degli RSVP completato con successo!')
      }
    }
  }

  // 3. Test Idee & Voti
  console.log('\n[3] TEST IDEE & VOTI...')
  if (adminClient) {
    // Inserisci idea
    const { data: testIdea, error: ideaError } = await adminClient.from('ideas').insert({
      author_id: testUser.id,
      title: 'Idea di Test Automata',
      description: 'Una splendida idea di test',
      category: 'video',
      status: 'proposta'
    }).select().single()

    if (ideaError) {
      console.error('❌ Errore creazione idea:', ideaError.message)
    } else {
      console.log('✅ Idea creata con successo! ID:', testIdea.id)

      // Vota idea
      const { error: voteError } = await adminClient.from('idea_votes').insert({
        idea_id: testIdea.id,
        user_id: testUser.id,
        vote: 'up'
      })

      if (voteError) {
        console.error('❌ Errore voto idea:', voteError.message)
      } else {
        console.log('✅ Voto idea inserito con successo!')

        // Aggiorna voto
        const { error: voteUpdateError } = await adminClient.from('idea_votes').update({
          vote: 'down'
        }).eq('idea_id', testIdea.id).eq('user_id', testUser.id)

        if (voteUpdateError) {
          console.error('❌ Errore aggiornamento voto idea:', voteUpdateError.message)
        } else {
          console.log('✅ Aggiornamento voto idea riuscito!')
        }
      }

      // Elimina idea
      const { error: deleteIdeaError } = await adminClient.from('ideas').delete().eq('id', testIdea.id)
      if (deleteIdeaError) {
        console.error('❌ Errore eliminazione idea:', deleteIdeaError.message)
      } else {
        console.log('✅ Idea e voti eliminati con successo (Cleanup)!')
      }
    }
  }

  console.log('\n=== CONCLUSIONE DEL TEST ===')
}

runTests()
