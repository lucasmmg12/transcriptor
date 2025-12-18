import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AnalisisAudio = {
    id: number
    fecha: string
    tipo_analisis: string
    transcripcion_original: string
    resultado_analisis: string
    created_at: string
}
