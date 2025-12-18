import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        // Verificar variables de entorno
        const checks = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            checks: {
                supabaseUrl: {
                    exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                    value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado ✓' : 'NO CONFIGURADO ✗',
                    length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
                },
                supabaseKey: {
                    exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado ✓' : 'NO CONFIGURADO ✗',
                    length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
                },
                openaiKey: {
                    exists: !!process.env.OPENAI_API_KEY,
                    value: process.env.OPENAI_API_KEY ? 'Configurado ✓' : 'NO CONFIGURADO ✗',
                    length: process.env.OPENAI_API_KEY?.length || 0,
                    prefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'N/A'
                }
            },
            allConfigured: !!(
                process.env.NEXT_PUBLIC_SUPABASE_URL &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                process.env.OPENAI_API_KEY
            )
        }

        return NextResponse.json(checks, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'Error en diagnóstico',
                message: error.message,
                stack: error.stack
            },
            { status: 500 }
        )
    }
}
