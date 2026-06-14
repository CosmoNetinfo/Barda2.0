-- Add is_pinned to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
