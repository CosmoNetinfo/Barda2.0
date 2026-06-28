-- Tabella commenti
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabella like ai commenti
CREATE TABLE IF NOT EXISTS public.idea_comment_likes (
  comment_id UUID NOT NULL REFERENCES public.idea_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (comment_id, user_id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS & Policies
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can access idea_comments" 
ON public.idea_comments FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can access idea_comment_likes" 
ON public.idea_comment_likes FOR ALL USING (auth.uid() IS NOT NULL);
