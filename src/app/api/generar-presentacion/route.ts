import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS } from '@/lib/openai'
import { estimateTokens } from '@/lib/audio-utils'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY no configurada' },
                { status: 500 }
            )
        }

        const body = await request.json()
        const { texto } = body

        if (!texto || typeof texto !== 'string') {
            return NextResponse.json(
                { error: 'Se requiere texto para generar la presentación' },
                { status: 400 }
            )
        }

        // Limitar longitud para evitar costos excesivos
        const MAX_CHARS = 25000
        const textoProcesar = texto.length > MAX_CHARS
            ? texto.substring(0, MAX_CHARS) + "..."
            : texto

        console.log(`📊 Generando presentación. Longitud texto: ${textoProcesar.length}`)

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPTS['generar-presentacion'],
                },
                {
                    role: 'user',
                    content: `Genera una presentación basada en el siguiente texto:\n\n${textoProcesar}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: "json_object" } // Asegura respuesta JSON
        })

        const content = completion.choices[0].message.content

        if (!content) {
            throw new Error('No se generó contenido por parte de OpenAI')
        }

        // Parsear JSON para validar
        const presentationData = JSON.parse(content)

        return NextResponse.json({
            success: true,
            data: presentationData
        })

    } catch (error: any) {
        console.error('❌ Error generando presentación:', error)
        return NextResponse.json(
            {
                error: 'Error al generar la presentación',
                details: error.message
            },
            { status: 500 }
        )
    }
}
