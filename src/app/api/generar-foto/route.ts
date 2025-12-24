import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Configuración
const MAX_ATTEMPTS_PER_HOUR = 3;
const IMAGEN_MODEL = 'imagen-3.0-generate-001';
const VISION_MODEL = 'gemini-1.5-flash';

export async function POST(request: NextRequest) {
    try {
        // 1. Validar configuraciones
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: 'Configuración de servidor incompleta (API KEY)' }, { status: 500 });
        }

        const body = await request.json();
        const { userDescription, userImage } = body;

        // 2. Obtener IP para Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 3. Verificar Rate Limit en Supabase (Omitido por brevedad, el bloque existente está bien)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from('generated_photos')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ip)
            .gte('created_at', oneHourAgo);

        if (count !== null && count >= MAX_ATTEMPTS_PER_HOUR) {
            return NextResponse.json({ error: `Has alcanzado el límite de ${MAX_ATTEMPTS_PER_HOUR} fotos por hora.` }, { status: 429 });
        }

        // 4. Analizar Foto con Gemini Vision (Si hay foto)
        let facialFeatures = userDescription || "professional person";

        if (userImage) {
            console.log('👁️ Analizando rostro con Gemini Vision...');
            try {
                // Eliminar el prefijo data:image...
                const base64Image = userImage.split(',')[1];

                const visionApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent?key=${process.env.GOOGLE_API_KEY}`;

                const visionResponse = await fetch(visionApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: "Describe in detail the facial features, hair style, color, age, gender, and skin tone of this person. Be concise but specific about visual traits. Ignore clothing and background." },
                                { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                            ]
                        }]
                    })
                });

                const visionData = await visionResponse.json();
                if (visionData.candidates && visionData.candidates[0].content) {
                    facialFeatures = visionData.candidates[0].content.parts[0].text;
                    console.log('🧬 Rasgos detectados:', facialFeatures);
                }
            } catch (err) {
                console.error('Error analizando imagen:', err);
                // Fallback a descripción manual si falla la visión
            }
        }

        // 5. Construir Prompt Final
        const finalPrompt = `Professional linkedin headshot of a person with these features: ${facialFeatures}. Wearing professional business attire (suit/blazer), neutral studio background, soft lighting, 8k resolution, photorealistic, confident smile.`;

        console.log('📸 Generando imagen con prompt:', finalPrompt);

        // 6. Llamar a Google Imagen 3
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${process.env.GOOGLE_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [{ prompt: finalPrompt }],
                parameters: { sampleCount: 1, aspectRatio: "1:1" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error Google Imagen API:', errorText);
            throw new Error(`Google AI Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        let imageBase64 = null;
        if (data.predictions?.[0]?.bytesBase64Encoded) {
            imageBase64 = data.predictions[0].bytesBase64Encoded;
        }

        if (!imageBase64) throw new Error('No se recibió imagen válida de Google AI');

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
