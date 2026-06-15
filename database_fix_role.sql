-- SQL Migration: Correggi il ruolo di default per i nuovi utenti
-- Cambia il default della colonna 'role' in 'membro' (prima era impostato su 'admin' o 'user' a seconda delle vecchie tabelle)
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'membro';

-- Esegui anche questo aggiornamento nel caso ci siano utenti registrati erroneamente come 'user' o 'admin'
-- UPDATE public.profiles SET role = 'membro' WHERE role = 'user';
