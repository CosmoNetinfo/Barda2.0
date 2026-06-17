-- SQL Migration: Correggi la tabella delle idee (aggiungi colonna category e rinomina body in description se presente)
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'articolo';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='ideas' AND column_name='body'
  ) THEN
    ALTER TABLE public.ideas RENAME COLUMN body TO description;
  END IF;
END $$;
