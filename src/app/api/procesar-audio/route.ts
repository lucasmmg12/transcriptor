import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS, TipoAnalisis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutos

export async function POST(request: NextRequest) {
    try {
        // Verificar variables de entorno críticas
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY no está configurada')
            return NextResponse.json(
                {
                    error: 'Configuración incompleta',
                    details: 'La API key de OpenAI no está configurada en las variables de entorno. Por favor configúrala en Vercel: Settings → Environment Variables → OPENAI_API_KEY'
                },
                { status: 500 }
            )
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('❌ Variables de Supabase no configuradas')
            return NextResponse.json(
                {
                    error: 'Configuración incompleta',
                    details: 'Las credenciales de Supabase no están configuradas. Por favor configúralas en Vercel.'
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

        console.log('📤 Iniciando transcripción con Whisper...')
        console.log('Archivo:', audioFile.name, 'Tamaño:', audioFile.size, 'bytes')

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
                    details: error.message || 'Error desconocido en OpenAI Whisper. Verifica que tu API key sea válida y tenga créditos.'
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
                    details: error.message || 'Error desconocido en GPT-4'
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
                        details: error.message + ' - Verifica que la tabla analisis_audios exista en Supabase.'
                    },
                    { status: 500 }
                )
            }

            console.log('✅ Guardado exitosamente en Supabase')

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
                    error: 'Error al guardar en la base de datos',
                    details: error.message
                },
                { status: 500 }
            )
        }
    } catch (error: any) {
        console.error('❌ Error general en el procesamiento:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar el audio',
                details: error.message || 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
