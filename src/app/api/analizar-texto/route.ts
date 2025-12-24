import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS, TipoAnalisis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { estimateTokens, splitTextIntoChunks } from '@/lib/audio-utils'

export const runtime = 'nodejs'
export const maxDuration = 60

// Límite de tokens para GPT-4 (dejamos margen para el system prompt y respuesta)
const MAX_TOKENS_PER_REQUEST = 6000

export async function POST(request: NextRequest) {
    try {
        // Verificar variables de entorno
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY no configurada' },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return NextResponse.json(
                { error: 'Credenciales de Supabase no configuradas' },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const body = await request.json()
        const { texto, tipo_analisis } = body

        if (!texto || typeof texto !== 'string') {
            return NextResponse.json(
                { error: 'No se proporcionó el texto de la transcripción' },
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (!tipo_analisis || !SYSTEM_PROMPTS[tipo_analisis as TipoAnalisis]) {
            return NextResponse.json(
                { error: 'Tipo de análisis inválido' },
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const transcription = texto
        const tipoAnalisis = tipo_analisis as TipoAnalisis

        console.log(`📤 Procesando texto manual (${transcription.length} caracteres)`)

        // Analizar con GPT-4 (con manejo inteligente de tokens)
        console.log('🤖 Analizando con GPT-4...')
        const estimatedTokens = estimateTokens(transcription)
        console.log(`📊 Tokens estimados: ${estimatedTokens}`)

        let analisis: string

        try {
            if (estimatedTokens <= MAX_TOKENS_PER_REQUEST) {
                // Transcripción corta - análisis directo
                console.log('✅ Transcripción dentro del límite - análisis directo')
                analisis = await analyzeText(transcription, tipoAnalisis)
            } else {
                // Transcripción larga - dividir en chunks
                console.log(`⚠️ Transcripción larga (${estimatedTokens} tokens) - dividiendo en chunks`)
                const chunks = splitTextIntoChunks(transcription, MAX_TOKENS_PER_REQUEST)
                console.log(`📦 Dividido en ${chunks.length} chunks`)

                // Analizar cada chunk
                const analyses: string[] = []
                for (let i = 0; i < chunks.length; i++) {
                    console.log(`📝 Analizando chunk ${i + 1}/${chunks.length}...`)
                    const chunkAnalysis = await analyzeText(
                        chunks[i],
                        tipoAnalisis,
                        `Parte ${i + 1} de ${chunks.length}`
                    )
                    analyses.push(chunkAnalysis)
                }

                // Combinar análisis
                analisis = combineAnalyses(analyses, tipoAnalisis, chunks.length)
            }

            console.log('✅ Análisis completado')
        } catch (error: any) {
            console.error('❌ Error en GPT-4:', error)

            if (error.message?.includes('maximum context length') || error.message?.includes('tokens')) {
                return NextResponse.json(
                    {
                        error: 'Transcripción demasiado larga',
                        details: `La transcripción generó demasiados tokens (${estimatedTokens} estimados).`
                    },
                    { status: 413, headers: { 'Content-Type': 'application/json' } }
                )
            }

            return NextResponse.json(
                {
                    error: 'Error al analizar',
                    details: error.message || 'Error en GPT-4'
                },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Retornar resultado
        return NextResponse.json({
            success: true,
            data: {
                transcripcion: transcription,
                analisis: analisis,
                tipo_analisis: tipoAnalisis,
                id: null,
                metadata: {
                    estimatedTokens,
                    wasChunked: estimatedTokens > MAX_TOKENS_PER_REQUEST
                }
            },
        }, { headers: { 'Content-Type': 'application/json' } })

    } catch (error: any) {
        console.error('❌ Error general:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar el texto',
                details: error.message || 'Error desconocido'
            },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// Funciones auxiliares duplicadas para no alterar el archivo original

async function analyzeText(text: string, tipoAnalisis: TipoAnalisis, label: string = ''): Promise<string> {
    const userMessage = label
        ? `${label}\n\nTranscripción a analizar:\n\n${text}`
        : `Transcripción a analizar:\n\n${text}`

    const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPTS[tipoAnalisis],
            },
            {
                role: 'user',
                content: userMessage,
            },
        ],
        temperature: 0.7,
        max_tokens: 2000,
    })

    return completion.choices[0].message.content || 'No se pudo generar el análisis'
}

function combineAnalyses(analyses: string[], tipoAnalisis: TipoAnalisis, totalChunks: number): string {
    const header = `📋 ANÁLISIS COMPLETO DE TEXTO LARGO
═══════════════════════════════════════════════════════════════
Este contenido fue procesado en ${totalChunks} partes debido a su extensión.
A continuación se presenta el análisis de cada parte:

`

    const combinedAnalyses = analyses.map((analysis, index) => {
        return `
═══════════════════════════════════════════════════════════════
📍 PARTE ${index + 1} DE ${totalChunks}
═══════════════════════════════════════════════════════════════

${analysis}
`
    }).join('\n')

    const footer = `
═══════════════════════════════════════════════════════════════
✅ ANÁLISIS COMPLETADO
═══════════════════════════════════════════════════════════════
Total de partes analizadas: ${totalChunks}
Tipo de análisis: ${obtenerNombreTipoAnalisis(tipoAnalisis)}
`

    return header + combinedAnalyses + footer
}

function obtenerNombreTipoAnalisis(tipo: string): string {
    const nombres: Record<string, string> = {
        'entrevista-trabajo': 'Entrevista de Trabajo',
        'reunion-cliente': 'Reunión con Cliente',
        'resumen-general': 'Resumen General',
    }
    return nombres[tipo] || tipo
}
