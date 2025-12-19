import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET(request: NextRequest) {
    try {
        const checks: any = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            openai: {
                configured: !!process.env.OPENAI_API_KEY,
                keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) || 'N/A',
                status: 'checking...'
            },
            supabase: {
                url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            }
        }

        // Verificar si la API key de OpenAI funciona
        if (process.env.OPENAI_API_KEY) {
            try {
                const openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                })

                // Hacer una llamada simple para verificar la API key
                await openai.models.list()

                checks.openai.status = '✅ API Key válida y funcionando'
            } catch (error: any) {
                checks.openai.status = '❌ Error: ' + error.message

                if (error.message?.includes('quota')) {
                    checks.openai.status = '❌ Sin créditos - Necesitas agregar créditos a tu cuenta de OpenAI'
                } else if (error.message?.includes('invalid')) {
                    checks.openai.status = '❌ API Key inválida'
                } else if (error.message?.includes('rate_limit')) {
                    checks.openai.status = '⚠️ Límite de rate alcanzado - Espera unos minutos'
                }
            }
        } else {
            checks.openai.status = '❌ API Key no configurada'
        }

        return NextResponse.json(checks, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'Error en verificación',
                message: error.message
            },
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
    }
}
