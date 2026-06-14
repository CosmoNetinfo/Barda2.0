-- Crea la tabella per i Gruppi
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 0, 9),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crea la tabella per i Membri del Gruppo
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'admin' o 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Abilita RLS (Row Level Security) per sicurezza
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- POLICY PER I GRUPPI

-- 1. Tutti gli utenti loggati possono creare un gruppo
CREATE POLICY "Users can create groups" 
ON groups FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Gli utenti possono vedere i gruppi di cui fanno parte
CREATE POLICY "Users can view groups they are members of" 
ON groups FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id = groups.id AND user_id = auth.uid()
  )
);

-- 3. Gli utenti autenticati possono leggere i gruppi tramite invite_code (serve per la funzione Unisciti)
CREATE POLICY "Users can find group by invite code" 
ON groups FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- POLICY PER I MEMBRI DEL GRUPPO

-- 1. Gli utenti possono vedere i membri dei gruppi a cui appartengono
CREATE POLICY "Users can view members of their groups" 
ON group_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM group_members gm 
    WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
  )
);

-- 2. Gli utenti possono inserire se stessi come membri (per unirsi o quando creano un gruppo)
CREATE POLICY "Users can insert themselves" 
ON group_members FOR INSERT 
WITH CHECK (user_id = auth.uid());
