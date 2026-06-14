-- ==============================================
-- BARDASCI APP - v0.2 MIGRATION (Bacheca Idee)
-- ==============================================

-- 1. Tabella delle IDEE
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  status TEXT DEFAULT 'proposta', -- 'proposta', 'approvata', 'realizzata', 'scartata'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabella dei VOTI alle idee
CREATE TABLE IF NOT EXISTS idea_votes (
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL, -- '+1', '-1', 'heart'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (idea_id, user_id)
);

-- ==============================================
-- ABILITAZIONE RLS E POLICY
-- ==============================================

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;

-- POLICY PER LE IDEE

-- Tutti gli utenti possono leggere le idee dei gruppi a cui appartengono
CREATE POLICY "Users can view ideas of their groups" 
ON ideas FOR SELECT 
USING (
  group_id IN (SELECT get_my_group_ids())
);

-- Gli utenti possono creare idee solo nei gruppi a cui appartengono
CREATE POLICY "Users can create ideas in their groups" 
ON ideas FOR INSERT 
WITH CHECK (
  group_id IN (SELECT get_my_group_ids())
  AND author_id = auth.uid()
);

-- Gli utenti (e magari gli admin in futuro) possono aggiornare lo stato
-- Per ora chiunque nel gruppo può aggiornare un'idea (per cambiare lo status)
CREATE POLICY "Users can update ideas in their groups"
ON ideas FOR UPDATE
USING (
  group_id IN (SELECT get_my_group_ids())
);

-- POLICY PER I VOTI

-- Gli utenti possono vedere i voti delle idee dei loro gruppi
CREATE POLICY "Users can view votes of their groups" 
ON idea_votes FOR SELECT 
USING (
  idea_id IN (SELECT id FROM ideas WHERE group_id IN (SELECT get_my_group_ids()))
);

-- Gli utenti possono inserire un voto per le idee del loro gruppo
CREATE POLICY "Users can vote on ideas in their groups" 
ON idea_votes FOR INSERT 
WITH CHECK (
  idea_id IN (SELECT id FROM ideas WHERE group_id IN (SELECT get_my_group_ids()))
  AND user_id = auth.uid()
);

-- Gli utenti possono modificare o eliminare il proprio voto
CREATE POLICY "Users can update their own votes"
ON idea_votes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own votes"
ON idea_votes FOR DELETE
USING (user_id = auth.uid());
