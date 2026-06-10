-- Add columns createdByEmail and createdByName physically to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS "createdByEmail" TEXT,
ADD COLUMN IF NOT EXISTS "createdByName" TEXT;
