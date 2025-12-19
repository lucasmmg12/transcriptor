import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS, TipoAnalisis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60 // Máximo para Vercel Pro (60 segundos)

// Límites de archivo
const MAX_FILE_SIZE_MB = 10 // 10MB = ~10 minutos de audio
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export async function POST(request: NextRequest) {
    try {
        // Verificar variables de entorno críticas
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY no está configurada')
            return NextResponse.json(
                {
                    error: 'Configuración incompleta',
                    details: 'La API key de OpenAI no está configurada. Contacta al administrador.'
                },
                { status: 500 }
            )
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('❌ Variables de Supabase no configuradas')
            return NextResponse.json(
                {
                    error: 'Configuración incompleta',
                    details: 'Las credenciales de Supabase no están configuradas.'
                },
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

        // Validar tamaño de archivo
        const fileSizeMB = audioFile.size / (1024 * 1024)
        const estimatedMinutes = Math.ceil(fileSizeMB) // Aproximadamente 1MB = 1 minuto

        if (audioFile.size > MAX_FILE_SIZE_BYTES) {
            console.warn(`⚠️ Archivo rechazado: ${fileSizeMB.toFixed(2)}MB (~${estimatedMinutes} minutos)`)
            return NextResponse.json(
                {
                    error: 'Archivo demasiado grande',
                    details: `Tu archivo de ${fileSizeMB.toFixed(2)}MB (~${estimatedMinutes} minutos de audio) excede el límite de ${MAX_FILE_SIZE_MB}MB.

⏱️ Límite de tiempo de Vercel: 60 segundos
📁 Límite recomendado: ${MAX_FILE_SIZE_MB}MB o 10 minutos de audio

💡 Soluciones:
1. Divide el audio en partes más pequeñas (máx. 10 minutos cada una)
2. Comprime el archivo de audio
3. Contacta con Grow Labs para procesar archivos grandes:
   https://api.whatsapp.com/send/?phone=5492643229503`,
                    fileSize: fileSizeMB,
                    estimatedDuration: estimatedMinutes,
                    maxAllowed: MAX_FILE_SIZE_MB
                },
                { status: 413 } // 413 Payload Too Large
            )
        }

        console.log('📤 Iniciando transcripción con Whisper...')
        console.log(`Archivo: ${audioFile.name} | Tamaño: ${fileSizeMB.toFixed(2)}MB | Estimado: ~${estimatedMinutes} min`)

        // Paso 1: Transcribir el audio con Whisper
        let transcription: string
        try {
            const result = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'es',
                response_format: 'text',
            })
            transcription = result.toString()
            console.log('✅ Transcripción completada')
        } catch (error: any) {
            console.error('❌ Error en Whisper:', error)
            return NextResponse.json(
                {
                    error: 'Error al transcribir el audio',
                    details: error.message || 'Verifica que tu API key de OpenAI sea válida y tenga créditos.'
                },
                { status: 500 }
            )
        }

        console.log('🤖 Iniciando análisis con GPT-4...')

        // Paso 2: Analizar la transcripción con GPT-4
        let analisis: string
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPTS[tipoAnalisis],
                    },
                    {
                        role: 'user',
                        content: `Transcripción a analizar:\n\n${transcription}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 2000,
            })

            analisis = completion.choices[0].message.content || 'No se pudo generar el análisis'
            console.log('✅ Análisis completado')
        } catch (error: any) {
            console.error('❌ Error en GPT-4:', error)
            return NextResponse.json(
                {
                    error: 'Error al analizar el texto',
                    details: error.message || 'Error en GPT-4'
                },
                { status: 500 }
            )
        }

        console.log('💾 Guardando en Supabase...')

        // Paso 3: Guardar en Supabase
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
                console.error('❌ Error al guardar en Supabase:', error)
                return NextResponse.json(
                    {
                        error: 'Error al guardar en la base de datos',
                        details: error.message
                    },
                    { status: 500 }
                )
            }

            console.log('✅ Guardado exitosamente')

            return NextResponse.json({
                success: true,
                data: {
                    transcripcion: transcription,
                    analisis: analisis,
                    tipo_analisis: tipoAnalisis,
                    id: data.id,
                },
            })
        } catch (error: any) {
            console.error('❌ Error en Supabase:', error)
            return NextResponse.json(
                {
                    error: 'Error al guardar',
                    details: error.message
                },
                { status: 500 }
            )
        }
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
