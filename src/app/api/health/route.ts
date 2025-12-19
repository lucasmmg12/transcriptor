import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const status = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            vercel: process.env.VERCEL ? 'Yes' : 'No',
            region: process.env.VERCEL_REGION || 'local',
            checks: {
                supabaseUrl: {
                    configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                    value: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configurado' : '✗ NO CONFIGURADO',
                },
                supabaseKey: {
                    configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configurado' : '✗ NO CONFIGURADO',
                },
                openaiKey: {
                    configured: !!process.env.OPENAI_API_KEY,
                    value: process.env.OPENAI_API_KEY ? '✓ Configurado' : '✗ NO CONFIGURADO',
                    prefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'N/A'
                }
            },
            allConfigured: !!(
                process.env.NEXT_PUBLIC_SUPABASE_URL &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                process.env.OPENAI_API_KEY
            ),
            message: ''
        }

        if (!status.allConfigured) {
            status.message = '⚠️ Faltan variables de entorno. Ve a Vercel → Settings → Environment Variables y configura todas las variables necesarias.'
        } else {
            status.message = '✅ Todas las variables están configuradas correctamente.'
        }

        return NextResponse.json(status, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'Error en diagnóstico',
                message: error.message
            },
            { status: 500 }
        )
    }
}
