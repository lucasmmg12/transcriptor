-- ============================================
-- Script de Configuración de Base de Datos
-- AudioInsight - Supabase PostgreSQL
-- ============================================

-- Crear la tabla analisis_audios
CREATE TABLE IF NOT EXISTS public.analisis_audios (
  id BIGSERIAL PRIMARY KEY,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo_analisis TEXT NOT NULL CHECK (tipo_analisis IN ('entrevista-trabajo', 'reunion-cliente', 'resumen-general')),
  transcripcion_original TEXT NOT NULL,
  resultado_analisis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_analisis_audios_created_at 
ON public.analisis_audios(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analisis_audios_tipo 
ON public.analisis_audios(tipo_analisis);

CREATE INDEX IF NOT EXISTS idx_analisis_audios_fecha 
ON public.analisis_audios(fecha DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.analisis_audios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Permitir todas las operaciones" ON public.analisis_audios;

-- Crear política para permitir todas las operaciones
-- NOTA: En producción, deberías ajustar estas políticas según tus necesidades de seguridad
CREATE POLICY "Permitir todas las operaciones" 
ON public.analisis_audios 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Comentarios para documentación de la tabla
COMMENT ON TABLE public.analisis_audios IS 'Almacena las transcripciones y análisis de archivos de audio procesados por la aplicación AudioInsight';

COMMENT ON COLUMN public.analisis_audios.id IS 'Identificador único del análisis';
COMMENT ON COLUMN public.analisis_audios.fecha IS 'Fecha y hora en que se realizó el análisis';
COMMENT ON COLUMN public.analisis_audios.tipo_analisis IS 'Tipo de análisis realizado: entrevista-trabajo, reunion-cliente, o resumen-general';
COMMENT ON COLUMN public.analisis_audios.transcripcion_original IS 'Texto completo transcrito del audio por OpenAI Whisper';
COMMENT ON COLUMN public.analisis_audios.resultado_analisis IS 'Análisis detallado generado por GPT-4 basado en el tipo seleccionado';
COMMENT ON COLUMN public.analisis_audios.created_at IS 'Timestamp de creación del registro en la base de datos';

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'analisis_audios'
ORDER BY ordinal_position;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Tabla analisis_audios creada exitosamente con todos los índices y políticas.';
END $$;

-- ============================================
-- Tabla para Rate Limiting de Fotos AI
-- ============================================

CREATE TABLE IF NOT EXISTS public.generated_photos (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_generated_photos_ip_created 
ON public.generated_photos(ip_address, created_at DESC);

ALTER TABLE public.generated_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insert publico" 
ON public.generated_photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir lectura publica" 
ON public.generated_photos 
FOR SELECT 
USING (true);

COMMENT ON TABLE public.generated_photos IS 'Registro de fotos generadas para control de rate-limit (3 por hora)';

