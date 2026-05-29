CREATE TABLE IF NOT EXISTS public.diagnosticos (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    empresa_rubro TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    mail TEXT NOT NULL,
    necesidad_principal TEXT NOT NULL,
    situacion_actual JSONB NOT NULL,
    resultado_esperado JSONB NOT NULL,
    herramientas_datos TEXT NOT NULL,
    personas_usuario TEXT NOT NULL,
    urgencia TEXT NOT NULL,
    decision JSONB NOT NULL,
    escala_solucion TEXT NOT NULL,
    material_util JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserción pública" ON public.diagnosticos;
CREATE POLICY "Permitir inserción pública" ON public.diagnosticos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura a autenticados" ON public.diagnosticos;
CREATE POLICY "Permitir lectura a autenticados" ON public.diagnosticos FOR SELECT TO authenticated USING (true);
