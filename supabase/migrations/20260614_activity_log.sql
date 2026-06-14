-- Migration for activity_log table

CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- e.g., 'idea', 'task', 'event', 'member'
    entity_id UUID,
    details JSONB
);

-- RLS Policies for activity_log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can view activity logs" 
    ON public.activity_log 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Any authenticated user can insert logs (or maybe only through server functions)
CREATE POLICY "Users can insert activity logs" 
    ON public.activity_log 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
