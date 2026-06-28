-- Aggiunge la colonna completed_at per il completamento individuale dei task
ALTER TABLE public.task_assignees
ADD COLUMN IF NOT EXISTS completed_at timestamptz DEFAULT NULL;
