import { NextRequest, NextResponse } from 'next/server'
import { openai, SYSTEM_PROMPTS, TipoAnalisis } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import FormData from 'form-data'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutos

export async function POST(request: NextRequest) {
    try {
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

        // Paso 1: Transcribir el audio con Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'es',
            response_format: 'text',
        })

        console.log('✅ Transcripción completada')
        console.log('🤖 Iniciando análisis con GPT-4...')

        // Paso 2: Analizar la transcripción con GPT-4
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

        const analisis = completion.choices[0].message.content || 'No se pudo generar el análisis'

        console.log('✅ Análisis completado')
        console.log('💾 Guardando en Supabase...')

        // Paso 3: Guardar en Supabase
        const { data, error } = await supabase
            .from('analisis_audios')
            .insert({
                fecha: new Date().toISOString(),
                tipo_analisis: tipoAnalisis,
                transcripcion_original: transcription.toString(),
                resultado_analisis: analisis,
            })
            .select()
            .single()

        if (error) {
            console.error('❌ Error al guardar en Supabase:', error)
            return NextResponse.json(
                { error: 'Error al guardar en la base de datos: ' + error.message },
                { status: 500 }
            )
        }

        console.log('✅ Guardado exitosamente en Supabase')

        return NextResponse.json({
            success: true,
            data: {
                transcripcion: transcription.toString(),
                analisis: analisis,
                tipo_analisis: tipoAnalisis,
                id: data.id,
            },
        })
    } catch (error: any) {
        console.error('❌ Error en el procesamiento:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar el audio',
                details: error.message
            },
            { status: 500 }
        )
    }
}
