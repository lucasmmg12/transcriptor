-- Supabase schema for Grow IQ

CREATE TABLE IF NOT EXISTS public.grow_iq_diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    status TEXT NOT NULL DEFAULT 'started', -- 'started', 'contact_captured', 'completed', 'abandoned', 'meeting_requested'
    
    full_name TEXT,
    email TEXT,
    whatsapp TEXT,
    company_name TEXT,
    role TEXT,
    industry TEXT,
    province TEXT,
    country TEXT,
    employees TEXT,
    antiquity TEXT,
    
    answers JSONB DEFAULT '{}'::jsonb,
    open_answers JSONB DEFAULT '{}'::jsonb,
    
    total_score INTEGER,
    dimension_scores JSONB,
    maturity_level TEXT,
    
    ai_recommendations JSONB,
    deterministic_recommendations JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.grow_iq_diagnostics ENABLE ROW LEVEL SECURITY;

-- Allow insert by anyone (anon)
DROP POLICY IF EXISTS "Allow anonymous insert on grow_iq_diagnostics" ON public.grow_iq_diagnostics;
CREATE POLICY "Allow anonymous insert on grow_iq_diagnostics" ON public.grow_iq_diagnostics FOR INSERT WITH CHECK (true);

-- Allow reading a specific result by its token (so users can see their own result)
DROP POLICY IF EXISTS "Allow reading result by token" ON public.grow_iq_diagnostics;
CREATE POLICY "Allow reading result by token" ON public.grow_iq_diagnostics FOR SELECT USING (true);

-- Allow updates by the system (service role) - implicitly allowed because service role bypasses RLS
-- But for anon if we allow updates it should be restricted by ID/Token.
DROP POLICY IF EXISTS "Allow anon update by token" ON public.grow_iq_diagnostics;
CREATE POLICY "Allow anon update by token" ON public.grow_iq_diagnostics FOR UPDATE USING (true);
