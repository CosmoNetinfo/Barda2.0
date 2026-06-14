-- ==============================================
-- BARDASCI APP - v0.3 to v1.0 MIGRATION
-- ==============================================

-- ==============================================
-- 1. TABELLE
-- ==============================================

-- 📅 EVENTI
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT NOT NULL,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_rsvp (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'yes', 'no', 'maybe'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- 🗳️ SONDAGGI
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT DEFAULT 'single', -- 'single', 'multi'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS poll_votes (
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (option_id, user_id)
);

-- ✅ TASK (COMPITI)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_assignees (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);

-- 📍 LUOGHI DA PROVARE
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
-- 2. ABILITAZIONE RLS
-- ==============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 3. RLS POLICIES
-- ==============================================

-- EVENTS
CREATE POLICY "Users can view events of their groups" ON events FOR SELECT USING (group_id IN (SELECT get_my_group_ids()));
CREATE POLICY "Users can create events in their groups" ON events FOR INSERT WITH CHECK (group_id IN (SELECT get_my_group_ids()) AND author_id = auth.uid());
CREATE POLICY "Users can update events of their groups" ON events FOR UPDATE USING (group_id IN (SELECT get_my_group_ids()));

-- EVENT RSVP
CREATE POLICY "Users can view rsvps of their groups" ON event_rsvp FOR SELECT USING (event_id IN (SELECT id FROM events WHERE group_id IN (SELECT get_my_group_ids())));
CREATE POLICY "Users can create rsvps in their groups" ON event_rsvp FOR INSERT WITH CHECK (event_id IN (SELECT id FROM events WHERE group_id IN (SELECT get_my_group_ids())) AND user_id = auth.uid());
CREATE POLICY "Users can update their rsvps" ON event_rsvp FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their rsvps" ON event_rsvp FOR DELETE USING (user_id = auth.uid());

-- POLLS
CREATE POLICY "Users can view polls of their groups" ON polls FOR SELECT USING (group_id IN (SELECT get_my_group_ids()));
CREATE POLICY "Users can create polls in their groups" ON polls FOR INSERT WITH CHECK (group_id IN (SELECT get_my_group_ids()) AND author_id = auth.uid());

-- POLL OPTIONS
CREATE POLICY "Users can view poll options of their groups" ON poll_options FOR SELECT USING (poll_id IN (SELECT id FROM polls WHERE group_id IN (SELECT get_my_group_ids())));
CREATE POLICY "Users can create poll options" ON poll_options FOR INSERT WITH CHECK (poll_id IN (SELECT id FROM polls WHERE group_id IN (SELECT get_my_group_ids())));

-- POLL VOTES
CREATE POLICY "Users can view poll votes of their groups" ON poll_votes FOR SELECT USING (poll_id IN (SELECT id FROM polls WHERE group_id IN (SELECT get_my_group_ids())));
CREATE POLICY "Users can vote on polls in their groups" ON poll_votes FOR INSERT WITH CHECK (poll_id IN (SELECT id FROM polls WHERE group_id IN (SELECT get_my_group_ids())) AND user_id = auth.uid());
CREATE POLICY "Users can update their poll votes" ON poll_votes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their poll votes" ON poll_votes FOR DELETE USING (user_id = auth.uid());

-- TASKS
CREATE POLICY "Users can view tasks of their groups" ON tasks FOR SELECT USING (group_id IN (SELECT get_my_group_ids()));
CREATE POLICY "Users can create tasks in their groups" ON tasks FOR INSERT WITH CHECK (group_id IN (SELECT get_my_group_ids()) AND author_id = auth.uid());
CREATE POLICY "Users can update tasks of their groups" ON tasks FOR UPDATE USING (group_id IN (SELECT get_my_group_ids()));

-- TASK ASSIGNEES
CREATE POLICY "Users can view task assignees of their groups" ON task_assignees FOR SELECT USING (task_id IN (SELECT id FROM tasks WHERE group_id IN (SELECT get_my_group_ids())));
CREATE POLICY "Users can create task assignees" ON task_assignees FOR INSERT WITH CHECK (task_id IN (SELECT id FROM tasks WHERE group_id IN (SELECT get_my_group_ids())));
CREATE POLICY "Users can delete task assignees" ON task_assignees FOR DELETE USING (task_id IN (SELECT id FROM tasks WHERE group_id IN (SELECT get_my_group_ids())));

-- PLACES
CREATE POLICY "Users can view places of their groups" ON places FOR SELECT USING (group_id IN (SELECT get_my_group_ids()));
CREATE POLICY "Users can create places in their groups" ON places FOR INSERT WITH CHECK (group_id IN (SELECT get_my_group_ids()) AND author_id = auth.uid());
CREATE POLICY "Users can update places of their groups" ON places FOR UPDATE USING (group_id IN (SELECT get_my_group_ids()));
