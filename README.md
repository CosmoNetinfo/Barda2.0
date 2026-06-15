# Bardasci App (Bardà)

Bardasci App è una piattaforma web collaborativa progettata per la gestione e il coordinamento delle attività di una community. Sviluppata con Next.js e integrata con Supabase, l'applicazione permette ai membri di scambiarsi idee, pianificare eventi, gestire compiti (task), votare sondaggi e tenere traccia di luoghi da visitare.

---

## 🚀 Funzionalità Principali

L'applicazione è suddivisa in diverse sezioni, ognuna pensata per facilitare la collaborazione tra i membri:

*   **💡 Bacheca delle Idee**: Uno spazio dove i membri possono proporre nuove iniziative, commentarle e raccogliere feedback.
*   **✅ Gestione dei Task (Compiti)**: Una lavagna Kanban/Tasklist per creare compiti, assegnarli a uno o più utenti, impostare scadenze e tracciare lo stato (`todo`, `in_progress`, `done`).
*   **🗳️ Sondaggi (Polls)**: Creazione di sondaggi a scelta singola o multipla per prendere decisioni di gruppo con visualizzazione delle percentuali di voto in tempo reale.
*   **📅 Calendario Eventi**: Organizzazione di incontri e attività con gestione delle conferme di partecipazione (RSVP: *Parteciperò*, *Non parteciperò*, *Forse*).
*   **📍 Luoghi da Provare (Places)**: Un archivio condiviso di locali, ristoranti o luoghi di interesse da visitare, con classificazione per categorie, rating e link a Google Maps.
*   **👥 Gestione dei Membri**: Pannello amministrativo per monitorare i profili iscritti e assegnare ruoli specifici all'interno della piattaforma.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router & React Server Actions)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) per un'interfaccia moderna, fluida e responsive
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Auth e Row Level Security)
*   **Hosting**: [Vercel](https://vercel.com/)

---

## 💻 Guida per lo Sviluppo Locale

### 1. Clonare il Repository e Installare le Dipendenze
Per iniziare, clona il repository sul tuo computer ed esegui l'installazione dei pacchetti npm:

```bash
git clone https://github.com/CosmoNetinfo/Barda2.0.git
cd bardasci-app
npm install
```

### 2. Configurare le Variabili d'Ambiente
Crea un file `.env.local` nella root del progetto partendo dal file di esempio `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Modifica il file `.env.local` inserendo le credenziali del tuo progetto Supabase:

```env
# Chiavi Pubbliche (sicure per il client e per il server)
NEXT_PUBLIC_SUPABASE_URL=https://tuo-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-anon-key

# Chiave Privata di Amministrazione (DA NON MOSTRARE MAI SUL CLIENT)
# Richiesta per le Server Action che eseguono modifiche amministrative (es. aggiornamento ruoli membri)
SUPABASE_SERVICE_ROLE_KEY=tua-service-role-key
```

### 3. Avviare il Server di Sviluppo
Avvia l'applicazione localmente in modalità di sviluppo:

```bash
npm run dev
```

L'app sarà visibile all'indirizzo [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Setup del Database (Supabase)

Il database è strutturato in PostgreSQL con Row Level Security (RLS) attiva per garantire che ogni membro possa accedere solo ai dati del proprio gruppo o della propria organizzazione.

### Struttura delle Tabelle principali
I file SQL per la migrazione e il setup del database sono disponibili nella root del progetto:
*   [database_final.sql](file:///d:/Bardà/bardasci-app/database_final.sql): Schema completo di tabelle (`events`, `event_rsvp`, `polls`, `poll_options`, `poll_votes`, `tasks`, `task_assignees`, `places`), abilitazione delle policy RLS e creazione delle policy di accesso per gruppi di utenti.

### Come Inizializzare il Database:
1.  Vai sul pannello di controllo di **Supabase** -> **SQL Editor**.
2.  Crea una **New Query**.
3.  Copia il contenuto di [database_final.sql](file:///d:/Bardà/bardasci-app/database_final.sql) ed eseguilo premendo **Run**.
4.  *(Opzionale)* Esegui le query di fix specifiche se riscontri anomalie con la creazione dei task o con le relazioni dei profili.

---

## 👥 Gestione Ruoli e Sicurezza

L'applicazione supporta un sistema gerarchico di ruoli per regolare l'accesso e le modifiche:

| Ruolo | Descrizione | Privilegi |
| :--- | :--- | :--- |
| **Founder** 👑 | Il creatore o proprietario primario. | Accesso totale, può cambiare il ruolo di chiunque. |
| **Admin** 🛡️ | Amministratore della community. | Gestione dei contenuti, può cambiare il ruolo dei membri standard. |
| **Redattore** ✏️ | Collaboratore di contenuti. | Può scrivere, creare eventi o task, ma non ha accesso alle impostazioni amministrative. |
| **Membro** 👤 | Membro standard della community. | Accesso di base in sola lettura e partecipazione alle attività (RSVP, voti). |

### Come funziona l'aggiornamento dei ruoli (Bypass RLS):
Per motivi di sicurezza, la tabella `profiles` ha delle policy RLS che impediscono ad un utente normale di aggiornare il profilo di altri utenti. 
Per ovviare a questo e consentire agli amministratori di modificare i ruoli senza disattivare la sicurezza globale:
1.  Il file [admin.ts](file:///d:/Bardà/bardasci-app/src/utils/supabase/admin.ts) istanzia un client Supabase speciale utilizzando la chiave `SUPABASE_SERVICE_ROLE_KEY`.
2.  La Server Action [members.ts](file:///d:/Bardà/bardasci-app/src/app/actions/members.ts) verifica prima se l'utente che sta chiamando l'azione è un **Founder** o un **Admin** (utilizzando il client utente normale e sicuro).
3.  Se la verifica va a buon fine, viene impiegato il client admin speciale (Service Role) per eseguire l'aggiornamento sulla tabella `profiles`, bypassando temporaneamente la RLS per quell'operazione specifica.

> [!IMPORTANT]
> Ricorda di configurare la variabile d'ambiente `SUPABASE_SERVICE_ROLE_KEY` anche sul tuo pannello di hosting (es. su Vercel in **Settings -> Environment Variables**), altrimenti il cambio dei ruoli dei membri non funzionerà e fallirà in produzione.

---

## 📦 Deploy su Vercel

Il deploy dell'applicazione può essere eseguito facilmente su Vercel:

1.  Connetti il tuo repository GitHub a Vercel.
2.  Imposta le seguenti **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY`
3.  Avvia il build. Vercel configurerà automaticamente l'ambiente Next.js in modalità serverless.
