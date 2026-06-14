-- ==============================================
-- BARDASCI APP - v2 REWRITE (SINGLE-TENANT)
-- ==============================================

-- RESET (Attenzione: eliminerà tutto)
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS task_assignees CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS event_rsvp CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================
-- 1. PROFILI (Estensione di auth.users)
-- ==============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Membro',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. TABELLE CORE (Nessun group_id)
-- ==============================================

-- 📅 EVENTI
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT NOT NULL,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_rsvp (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'yes', 'no', 'maybe'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- 💡 IDEE
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'articolo', -- 'articolo', 'video', 'social', 'evento'
  status TEXT DEFAULT 'proposta', -- 'proposta', 'approvata', 'in lavorazione', 'pubblicata', 'scartata'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE idea_votes (
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote TEXT NOT NULL, -- 'up', 'down'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (idea_id, user_id)
);

-- 🗳️ SONDAGGI
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT DEFAULT 'single', -- 'single', 'multi'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL
);

CREATE TABLE poll_votes (
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (option_id, user_id)
);

-- ✅ TASK (COMPITI)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE task_assignees (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- 📍 LUOGHI DA PROVARE
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  maps_url TEXT,
  status TEXT DEFAULT 'da_provare', -- 'da_provare', 'visitato'
  rating INTEGER,
  visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. ABILITAZIONE RLS
-- ==============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 4. RLS POLICIES (Intranet privata: tutti gli autenticati possono leggere e scrivere)
-- ==============================================
-- Nota: se un utente è loggato con auth.uid() != null, ha accesso all'app.

CREATE POLICY "Authenticated users can access profiles" ON profiles FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access events" ON events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access event_rsvp" ON event_rsvp FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access ideas" ON ideas FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access idea_votes" ON idea_votes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access polls" ON polls FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access poll_options" ON poll_options FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access poll_votes" ON poll_votes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access tasks" ON tasks FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access task_assignees" ON task_assignees FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can access places" ON places FOR ALL USING (auth.uid() IS NOT NULL);

-- ==============================================
-- 5. TRIGGER PER AUTO-CREAZIONE PROFILO
-- ==============================================
-- Quando un nuovo utente fa login tramite Google, Supabase crea un record in auth.users.
-- Questo trigger crea automaticamente un record in profiles.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sincronizza utenti già esistenti in auth.users se non hanno un profilo
INSERT INTO public.profiles (id, name, avatar_url)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', email), 
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
