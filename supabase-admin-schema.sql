-- =======================================================
-- SCRIPT DE BASE DE DATOS DE ADMINISTRACIÓN (GROW LABS)
-- =======================================================
-- Ejecuta este script en la consola de SQL de tu panel de Supabase
-- para crear las tablas y las políticas de acceso (RLS) necesarias.

-- Eliminar tablas si ya existen
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;

-- 1. Tabla de Tareas (tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id BIGSERIAL PRIMARY KEY,
  "phase" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "expectedResult" TEXT,
  "responsible" TEXT NOT NULL,
  "priority" TEXT,
  "status" TEXT NOT NULL,
  "startDate" TEXT NOT NULL,
  "targetDate" TEXT NOT NULL,
  "closeDate" TEXT,
  "progress" NUMERIC DEFAULT 0,
  "observations" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- 2. Tabla de Leads (leads)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  "company" TEXT,
  "contactName" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT,
  "stage" TEXT NOT NULL,
  "source" TEXT,
  "interestedService" TEXT,
  "estimatedValue" NUMERIC DEFAULT 0,
  "notes" TEXT,
  "nextAction" TEXT,
  "nextActionDate" TEXT,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 3. Tabla de Proyectos (projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "client" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL,
  "progress" NUMERIC DEFAULT 0,
  "value" NUMERIC DEFAULT 0,
  "startDate" TEXT NOT NULL,
  "estimatedEndDate" TEXT NOT NULL,
  "actualEndDate" TEXT,
  "assignedTo" TEXT[] DEFAULT '{}',
  "milestones" JSONB DEFAULT '[]'::jsonb,
  "notes" TEXT,
  "createdAt" TEXT NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 4. Tabla de Miembros de Equipo (team_members)
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "avatar" TEXT,
  "joinDate" TEXT NOT NULL,
  "active" BOOLEAN DEFAULT true,
  "skills" TEXT[] DEFAULT '{}',
  "currentProjects" TEXT[] DEFAULT '{}'
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- 5. Tabla de Reuniones (meetings)
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY,
  "date" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "attendees" TEXT[] DEFAULT '{}',
  "decisions" JSONB DEFAULT '[]'::jsonb,
  "nextSteps" TEXT,
  "commitmentDate" TEXT,
  "status" TEXT NOT NULL,
  "notes" TEXT
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);

-- 6. Tabla de Propuestas Comerciales (proposals)
CREATE TABLE IF NOT EXISTS public.proposals (
  id TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "object" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "mainIdea" TEXT NOT NULL,
  "valueArs" NUMERIC DEFAULT 0,
  "detailsJson" JSONB DEFAULT '{}'::jsonb,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todas las operaciones proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);
