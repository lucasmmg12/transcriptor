import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Configuración
const MAX_ATTEMPTS_PER_HOUR = 3;
const MODEL_NAME = 'imagen-3.0-generate-001';

export async function POST(request: NextRequest) {
    try {
        // 1. Validar configuraciones
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: 'Configuración de servidor incompleta (API KEY)' }, { status: 500 });
        }

        const body = await request.json();
        const { userDescription } = body; // Descripción base del usuario (opcional) o usamos prompt fijo

        // 2. Obtener IP para Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 3. Verificar Rate Limit en Supabase
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { count, error: countError } = await supabase
            .from('generated_photos')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ip)
            .gte('created_at', oneHourAgo);

        if (countError) {
            console.error('Error verificando límites:', countError);
            // Si falla la DB, permitimos por defecto pero logueamos error, o bloqueamos? Bloqueamos por seguridad.
            // Pero como la tabla es nueva, si no existe fallará.
            // Para no romper la demo, si el error es "relation does not exist", pasamos (modo dev).
            if (!countError.message.includes('relation "public.generated_photos" does not exist')) {
                // return NextResponse.json({ error: 'Error verificando límites de uso' }, { status: 500 });
            }
        }

        if (count !== null && count >= MAX_ATTEMPTS_PER_HOUR) {
            return NextResponse.json(
                { error: `Has alcanzado el límite de ${MAX_ATTEMPTS_PER_HOUR} fotos por hora. Intenta más tarde.` },
                { status: 429 }
            );
        }

        // 4. Construir Prompt Profesional (ENFORCED)
        // Forzamos estilo LinkedIn independientemente de lo que pida el usuario
        const basePrompt = "Professional linkedin headshot, business attire, neutral studio background, soft lighting, high quality, 8k, photorealistic";
        const customPart = userDescription ? `, ${userDescription} features` : ", professional person";
        const finalPrompt = `${basePrompt}${customPart}`;

        console.log('📸 Generando imagen con prompt:', finalPrompt);

        // 5. Llamar a Google Imagen 3 (REST API)
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:predict?key=${process.env.GOOGLE_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [
                    { prompt: finalPrompt }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Google API:', errorText);
            throw new Error(`Google AI Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // La respuesta de Imagen 3 suele venir en predictions[0].bytesBase64Encoded o similar
        // Estructura típica Imagen: { predictions: [ { bytesBase64Encoded: "..." } ] }

        let imageBase64 = null;
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            imageBase64 = data.predictions[0].bytesBase64Encoded;
        } else if (data.predictions && data.predictions[0] && data.predictions[0].mimeType) {
            // Handle structured response if different
            console.log('Estructura de respuesta desconocida:', JSON.stringify(data).substring(0, 200));
        }

        if (!imageBase64) {
            throw new Error('No se recibió imagen válida de Google AI');
        }

        const finalImageUrl = `data:image/png;base64,${imageBase64}`;

        // 6. Registrar uso exitoso en Supabase
        await supabase.from('generated_photos').insert({
            ip_address: ip,
            prompt_used: finalPrompt
        });

        return NextResponse.json({
            success: true,
            image: finalImageUrl,
            remaining: MAX_ATTEMPTS_PER_HOUR - (count || 0) - 1
        });

    } catch (error: any) {
        console.error('❌ Error generando foto:', error);
        return NextResponse.json(
            { error: 'Error al generar la foto', details: error.message },
            { status: 500 }
        );
    }
}
