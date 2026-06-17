-- Aggiunge colonna consenso privacy
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS consent_accepted_at timestamptz DEFAULT NULL;
