import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS, TipoAnalisis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

// Límite por chunk para procesamiento seguro
const CHUNK_SIZE_MB = 8 // 8MB por chunk (~8 minutos)
const CHUNK_SIZE_BYTES = CHUNK_SIZE_MB * 1024 * 1024

interface ProcessingProgress {
    currentChunk: number
    totalChunks: number
    status: string
}

export async function POST(request: NextRequest) {
    try {
        // Verificar variables de entorno
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY no configurada' },
                { status: 500 }
            )
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return NextResponse.json(
                { error: 'Credenciales de Supabase no configuradas' },
                { status: 500 }
            )
        }

        const formData = await request.formData()
        const audioFile = formData.get('audio') as File
        const tipoAnalisis = formData.get('tipo_analisis') as TipoAnalisis

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No se proporcionó archivo de audio' },
                { status: 400 }
            )
        }

        if (!tipoAnalisis || !SYSTEM_PROMPTS[tipoAnalisis]) {
            return NextResponse.json(
                { error: 'Tipo de análisis inválido' },
                { status: 400 }
            )
        }

        const fileSizeMB = audioFile.size / (1024 * 1024)
        console.log(`📤 Procesando: ${audioFile.name} (${fileSizeMB.toFixed(2)}MB)`)

        // Verificar límite absoluto (OpenAI Whisper tiene límite de 25MB)
        if (audioFile.size > 25 * 1024 * 1024) {
            return NextResponse.json(
                {
                    error: 'Archivo demasiado grande',
                    details: `El archivo de ${fileSizeMB.toFixed(2)}MB excede el límite de OpenAI Whisper (25MB). Por favor, comprime el audio o reduce su duración.`
                },
                { status: 413 }
            )
        }

        // Si el archivo es pequeño, procesarlo directamente
        if (audioFile.size <= CHUNK_SIZE_BYTES) {
            console.log('✅ Archivo pequeño - procesamiento directo')
            return await processSingleFile(audioFile, tipoAnalisis)
        }

        // Archivo grande - procesar en modo streaming/chunks
        console.log('⚠️ Archivo grande - procesamiento optimizado')
        return await processLargeFile(audioFile, tipoAnalisis)

    } catch (error: any) {
        console.error('❌ Error general:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar el audio',
                details: error.message || 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Procesar archivo pequeño directamente
async function processSingleFile(audioFile: File, tipoAnalisis: TipoAnalisis) {
    try {
        console.log('📝 Transcribiendo con Whisper...')

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'es',
            response_format: 'text',
        })

        const transcriptionText = transcription.toString()
        console.log('✅ Transcripción completada')

        console.log('🤖 Analizando con GPT-4...')

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPTS[tipoAnalisis],
                },
                {
                    role: 'user',
                    content: `Transcripción a analizar:\n\n${transcriptionText}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        })

        const analisis = completion.choices[0].message.content || 'No se pudo generar el análisis'
        console.log('✅ Análisis completado')

        console.log('💾 Guardando en Supabase...')

        const { data, error } = await supabase
            .from('analisis_audios')
            .insert({
                fecha: new Date().toISOString(),
                tipo_analisis: tipoAnalisis,
                transcripcion_original: transcriptionText,
                resultado_analisis: analisis,
            })
            .select()
            .single()

        if (error) {
            console.error('❌ Error en Supabase:', error)
            return NextResponse.json(
                { error: 'Error al guardar', details: error.message },
                { status: 500 }
            )
        }

        console.log('✅ Guardado exitoso')

        return NextResponse.json({
            success: true,
            data: {
                transcripcion: transcriptionText,
                analisis: analisis,
                tipo_analisis: tipoAnalisis,
                id: data.id,
            },
        })
    } catch (error: any) {
        console.error('❌ Error en procesamiento:', error)
        return NextResponse.json(
            { error: 'Error al procesar', details: error.message },
            { status: 500 }
        )
    }
}

// Procesar archivo grande con estrategia optimizada
async function processLargeFile(audioFile: File, tipoAnalisis: TipoAnalisis) {
    try {
        console.log('📝 Transcribiendo archivo grande con Whisper...')
        console.log('⚡ Usando procesamiento optimizado para evitar timeout')

        // Para archivos grandes, usamos una estrategia diferente:
        // 1. Transcribir el archivo completo (Whisper es rápido)
        // 2. Dividir la transcripción en partes
        // 3. Analizar solo un resumen o las partes más importantes

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'es',
            response_format: 'text',
            // Whisper puede manejar hasta 25MB sin problemas
        })

        const transcriptionText = transcription.toString()
        const transcriptionLength = transcriptionText.length
        console.log(`✅ Transcripción completada (${transcriptionLength} caracteres)`)

        console.log('🤖 Analizando transcripción larga con GPT-4...')

        // Para transcripciones muy largas, hacemos un análisis más eficiente
        let analisis: string

        if (transcriptionLength > 10000) {
            // Transcripción muy larga - hacer análisis en dos partes
            console.log('📊 Transcripción larga detectada - análisis optimizado')

            const midPoint = Math.floor(transcriptionLength / 2)
            const part1 = transcriptionText.substring(0, midPoint)
            const part2 = transcriptionText.substring(midPoint)

            // Analizar ambas partes
            const [analysis1, analysis2] = await Promise.all([
                analyzeText(part1, tipoAnalisis, '(Parte 1/2)'),
                analyzeText(part2, tipoAnalisis, '(Parte 2/2)')
            ])

            // Combinar análisis
            analisis = `📋 ANÁLISIS COMPLETO DE AUDIO LARGO\n\n` +
                `═══════════════════════════════════════\n` +
                `PRIMERA MITAD:\n${analysis1}\n\n` +
                `═══════════════════════════════════════\n` +
                `SEGUNDA MITAD:\n${analysis2}\n\n` +
                `═══════════════════════════════════════\n` +
                `NOTA: Este audio fue procesado en dos partes debido a su extensión.`
        } else {
            // Transcripción normal - análisis directo
            analisis = await analyzeText(transcriptionText, tipoAnalisis)
        }

        console.log('✅ Análisis completado')

        console.log('💾 Guardando en Supabase...')

        const { data, error } = await supabase
            .from('analisis_audios')
            .insert({
                fecha: new Date().toISOString(),
                tipo_analisis: tipoAnalisis,
                transcripcion_original: transcriptionText,
                resultado_analisis: analisis,
            })
            .select()
            .single()

        if (error) {
            console.error('❌ Error en Supabase:', error)
            return NextResponse.json(
                { error: 'Error al guardar', details: error.message },
                { status: 500 }
            )
        }

        console.log('✅ Guardado exitoso')

        return NextResponse.json({
            success: true,
            data: {
                transcripcion: transcriptionText,
                analisis: analisis,
                tipo_analisis: tipoAnalisis,
                id: data.id,
                isLargeFile: true,
            },
        })
    } catch (error: any) {
        console.error('❌ Error en procesamiento de archivo grande:', error)
        return NextResponse.json(
            { error: 'Error al procesar archivo grande', details: error.message },
            { status: 500 }
        )
    }
}

// Función auxiliar para analizar texto
async function analyzeText(text: string, tipoAnalisis: TipoAnalisis, label: string = ''): Promise<string> {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPTS[tipoAnalisis],
            },
            {
                role: 'user',
                content: `Transcripción a analizar ${label}:\n\n${text}`,
            },
        ],
        temperature: 0.7,
        max_tokens: 2000,
    })

    return completion.choices[0].message.content || 'No se pudo generar el análisis'
}
