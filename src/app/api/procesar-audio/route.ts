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

        const formData = await request.formData()
        const audioFile = formData.get('audio') as File
        const tipoAnalisis = formData.get('tipo_analisis') as TipoAnalisis

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No se proporcionó archivo de audio' },
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (!tipoAnalisis || !SYSTEM_PROMPTS[tipoAnalisis]) {
            return NextResponse.json(
                { error: 'Tipo de análisis inválido' },
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const fileSizeMB = audioFile.size / (1024 * 1024)
        console.log(`📤 Procesando: ${audioFile.name} (${fileSizeMB.toFixed(2)}MB)`)

        // Verificar límite de OpenAI Whisper
        if (audioFile.size > 25 * 1024 * 1024) {
            return NextResponse.json(
                {
                    error: 'Archivo demasiado grande',
                    details: `El archivo de ${fileSizeMB.toFixed(2)}MB excede el límite de 25MB de OpenAI Whisper.`
                },
                { status: 413, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // PASO 1: Transcribir con Whisper
        console.log('📝 Transcribiendo con Whisper...')
        let transcription: string

        try {
            const result = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'es',
                response_format: 'text',
            })
            transcription = result.toString()
            console.log(`✅ Transcripción completada (${transcription.length} caracteres)`)
        } catch (error: any) {
            console.error('❌ Error en Whisper:', error)
            return NextResponse.json(
                {
                    error: 'Error al transcribir',
                    details: error.message || 'Error en OpenAI Whisper'
                },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // PASO 2: Analizar con GPT-4 (con manejo inteligente de tokens)
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

            // Manejar error de tokens específicamente
            if (error.message?.includes('maximum context length') || error.message?.includes('tokens')) {
                return NextResponse.json(
                    {
                        error: 'Transcripción demasiado larga',
                        details: `La transcripción generó demasiados tokens (${estimatedTokens} estimados). El audio es muy largo o tiene mucho contenido. Intenta con un audio más corto.`
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

        // PASO 3: Guardar en Supabase
        console.log('💾 Guardando en Supabase...')

        try {
            const { data, error } = await supabase
                .from('analisis_audios')
                .insert({
                    fecha: new Date().toISOString(),
                    tipo_analisis: tipoAnalisis,
                    transcripcion_original: transcription,
                    resultado_analisis: analisis,
                })
                .select()
                .single()

            if (error) {
                console.error('❌ Error en Supabase:', error)
                return NextResponse.json(
                    {
                        error: 'Error al guardar',
                        details: error.message
                    },
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                )
            }

            console.log('✅ Guardado exitoso')

            return NextResponse.json({
                success: true,
                data: {
                    transcripcion: transcription,
                    analisis: analisis,
                    tipo_analisis: tipoAnalisis,
                    id: data.id,
                    metadata: {
                        estimatedTokens,
                        wasChunked: estimatedTokens > MAX_TOKENS_PER_REQUEST
                    }
                },
            }, { headers: { 'Content-Type': 'application/json' } })

        } catch (error: any) {
            console.error('❌ Error en Supabase:', error)
            return NextResponse.json(
                {
                    error: 'Error al guardar',
                    details: error.message
                },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

    } catch (error: any) {
        console.error('❌ Error general:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar el audio',
                details: error.message || 'Error desconocido'
            },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// Función auxiliar para analizar texto
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

// Función para combinar múltiples análisis
function combineAnalyses(analyses: string[], tipoAnalisis: TipoAnalisis, totalChunks: number): string {
    const header = `📋 ANÁLISIS COMPLETO DE AUDIO LARGO
═══════════════════════════════════════════════════════════════
Este audio fue procesado en ${totalChunks} partes debido a su extensión.
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
