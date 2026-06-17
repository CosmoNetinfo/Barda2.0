import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 text-gray-800 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
        {/* Pulsante Torna al Login */}
        <div className="mb-8">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-semibold text-[#E8201A] hover:text-[#d11913] transition-colors gap-1.5"
          >
            ← Torna al login
          </Link>
        </div>

        {/* Intestazione */}
        <header className="border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img src="/bardasci-logo.png" alt="Logo" className="h-10 object-contain" />
            <span className="font-barlow font-extrabold text-3xl tracking-tight uppercase text-gray-900">Bardà</span>
          </div>
          <h1 className="text-4xl font-extrabold font-barlow text-gray-900 uppercase tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            App interna de Li Bardasci • Ultimo aggiornamento: giugno 2026
          </p>
        </header>

        {/* Contenuto */}
        <div className="space-y-8 leading-relaxed text-gray-600">
          <section className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100/30">
            <p className="font-medium text-gray-700">
              <strong>Titolare del trattamento:</strong> <a href="https://www.cosmonet.info" target="_blank" rel="noopener noreferrer" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">Daniele Spalletti (CosmoNet.info)</a><br />
              <strong>Email di contatto:</strong> <a href="mailto:admindany@gmail.com" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">admindany@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              1. Cos&apos;è Bardà
            </h2>
            <p>
              Bardà è un&apos;applicazione web privata riservata esclusivamente ai membri del gruppo satirico &quot;Li Bardasci&quot;. L&apos;accesso è consentito solo tramite invito diretto tramite account Google. L&apos;app non è pubblica e non è accessibile a terzi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              2. Dati raccolti
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dati di autenticazione (tramite Google OAuth)</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Foto profilo Google</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dati del profilo</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Nome visualizzato (modificabile)</li>
                  <li>Biografia breve (inserita volontariamente)</li>
                  <li>Avatar personalizzato (caricato volontariamente)</li>
                  <li>Ruolo nell&apos;app (assegnato dall&apos;amministratore)</li>
                  <li>Data di iscrizione</li>
                  <li>Data e ora di accettazione della privacy policy</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dati di utilizzo</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Idee create, votate o commentate</li>
                  <li>Task creati, assegnati o completati</li>
                  <li>Partecipazioni agli eventi (RSVP)</li>
                  <li>Sondaggi creati e risposte fornite</li>
                  <li>Luoghi aggiunti o votati</li>
                  <li>Log delle attività svolte nell&apos;app</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Dati tecnici</h3>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Data e ora degli accessi</li>
                  <li>Indirizzo IP (gestito da Supabase e Vercel)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              3. Finalità del trattamento
            </h2>
            <p className="mb-3">
              I dati vengono trattati esclusivamente per:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 mb-3">
              <li>Permettere l&apos;accesso e l&apos;utilizzo dell&apos;app da parte dei membri</li>
              <li>Mostrare il profilo utente agli altri membri del gruppo</li>
              <li>Coordinare le attività del gruppo (eventi, task, idee, sondaggi)</li>
              <li>Garantire la sicurezza e il corretto funzionamento dell&apos;app</li>
              <li>Rispettare obblighi di legge</li>
            </ul>
            <p className="font-semibold text-gray-800">
              I tuoi dati non vengono venduti, ceduti o condivisi con terze parti a fini commerciali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              4. Base giuridica del trattamento
            </h2>
            <p>
              Il trattamento si basa sul <strong>consenso esplicito</strong> dell&apos;utente, espresso al momento del primo accesso tramite accettazione della presente policy (checkbox obbligatorio al login). Il consenso viene salvato con data e timestamp nel database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              5. Dove vengono conservati i dati
            </h2>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li><strong>Supabase</strong> — database e storage, server in Europa (EU-West)</li>
              <li><strong>Vercel</strong> — hosting dell&apos;applicazione, infrastruttura cloud</li>
              <li><strong>Google</strong> — autenticazione OAuth, soggetto alle policy di Google</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">
              Tutti i fornitori sono conformi al GDPR e al Regolamento UE 2016/679.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              6. Conservazione dei dati
            </h2>
            <p>
              I dati vengono conservati per tutta la durata della partecipazione al gruppo. In caso di rimozione dal gruppo o richiesta di cancellazione, i dati vengono eliminati entro 30 giorni dalla richiesta. I log di attività vengono conservati per un massimo di 12 mesi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              7. I tuoi diritti (GDPR)
            </h2>
            <p className="mb-3">
              In qualità di interessato hai diritto a:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 mb-3">
              <li><strong>Accesso</strong> — sapere quali dati abbiamo su di te</li>
              <li><strong>Rettifica</strong> — correggere dati inesatti</li>
              <li><strong>Cancellazione</strong> — chiedere la rimozione dei tuoi dati</li>
              <li><strong>Portabilità</strong> — ricevere i tuoi dati in formato leggibile</li>
              <li><strong>Opposizione</strong> — opporti al trattamento in qualsiasi momento</li>
              <li><strong>Revoca del consenso</strong> — ritirare il consenso senza conseguenze</li>
            </ul>
            <p>
              Per esercitare questi diritti scrivi a: <a href="mailto:admindany@gmail.com" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">admindany@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              8. Cookie e tecnologie di tracciamento
            </h2>
            <p>
              Bardà utilizza esclusivamente cookie tecnici necessari al funzionamento dell&apos;app (sessione di autenticazione). Non utilizza cookie di profilazione o strumenti di tracciamento di terze parti a fini pubblicitari.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              9. Sicurezza dei dati
            </h2>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Connessioni cifrate HTTPS</li>
              <li>Autenticazione tramite Google OAuth</li>
              <li>Accesso al database protetto da Row Level Security (RLS) di Supabase</li>
              <li>Accesso all&apos;app limitato ai soli membri invitati</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              10. Modifiche alla privacy policy
            </h2>
            <p>
              Eventuali modifiche verranno comunicate ai membri tramite l&apos;app. L&apos;uso continuato dopo la notifica equivale all&apos;accettazione delle modifiche.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-barlow text-[#E8201A] uppercase tracking-wide mb-3">
              11. Contatti
            </h2>
            <p className="font-medium text-gray-700">
              <strong>Daniele Spalletti (CosmoNet.info)</strong><br />
              Email: <a href="mailto:admindany@gmail.com" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">admindany@gmail.com</a><br />
              Sito: <a href="https://www.cosmonet.info" target="_blank" rel="noopener noreferrer" className="text-[#E8201A] underline font-medium hover:text-[#d11913]">https://www.cosmonet.info</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
