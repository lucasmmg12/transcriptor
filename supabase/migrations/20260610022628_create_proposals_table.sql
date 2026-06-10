-- Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    object TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    "mainIdea" TEXT NOT NULL,
    "valueArs" NUMERIC NOT NULL DEFAULT 0,
    "detailsJson" JSONB NOT NULL DEFAULT '{"objectives": [], "scope": [], "investmentDetails": []}'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.proposals;
CREATE POLICY "Enable read access for all users" ON public.proposals
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.proposals;
CREATE POLICY "Enable insert for all users" ON public.proposals
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON public.proposals;
CREATE POLICY "Enable delete for all users" ON public.proposals
    FOR DELETE USING (true);
