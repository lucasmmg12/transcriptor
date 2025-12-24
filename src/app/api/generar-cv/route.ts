import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `
Eres un experto redactor de currículums y orientador laboral de alto nivel.
Tu tarea es convertir descripciones informales, desordenadas o coloquiales de los usuarios en un JSON perfectamente estructurado para un CV profesional.

REGLAS DE ORO:
1. **Redacción Ejecutiva:** Transforma frases simples como "vendía cosas" en "Gestión estratégica de ventas y atención al cliente". Usa verbos de acción fuertes (Lideró, Gestionó, Desarrolló, Optimizó).
2. **Inferencia Inteligente:**
   - Si el usuario menciona "manejé un equipo", agrega "Liderazgo" en habilidades.
   - Si menciona tareas de oficina, infiere habilidades como "Organización", "Gestión del Tiempo".
   - Si no menciona fechas exactas, estima o pon "20XX - 20XX" (pero trata de deducir por el contexto).
3. **Estructura estricta:** Devuelve SOLO un objeto JSON válido que cumpla con la interfaz CVData.

Estructura del JSON a devolver:
{
    "personalInfo": {
        "firstName": "String (Mayúsculas)",
        "lastName": "String (Mayúsculas)",
        "title": "String (Ej: 'Gestión Administrativa • Ventas')",
        "birthDate": "String (dd/mm/aaaa)",
        "familyStatus": "String (Ej: 'Soltero', 'Casado')",
        "phone": "String",
        "email": "String",
        "instagram": "String (o vacío)",
        "location": "String",
        "imageUrl": "" (Dejar vacío siempre)
    },
    "profile": "String (Un párrafo profesional, persuasivo y bien redactado de 4-5 líneas resumiendo el perfil)",
    "experience": [
        {
            "id": "String (timestamp único)",
            "role": "String (Cargo profesional)",
            "year": "String (Ej: '2020 - Actualidad')",
            "company": "String",
            "description": "String (Lista de logros con • salto de línea. Ej: • Logro 1\\n• Logro 2\\n• Logro 3)"
        }
    ],
    "education": [
        {
            "id": "String (timestamp único)",
            "title": "String",
            "institution": "String",
            "detail": "String (Ej: 'En curso', 'Completo')"
        }
    ],
    "skills": ["String", "String", "String", "String"],
    "courses": [
        {
            "id": "String (timestamp único)",
            "name": "String",
            "institution": "String"
        }
    ],
    "languagesAndSoftware": "String (Texto libre con viñetas. Ej: • Inglés (Intermedio)\\n• Excel Avanzado)"
}
`;

export async function POST(request: NextRequest) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OPENAI_API_KEY no configurada' }, { status: 500 });
        }

        const body = await request.json();
        const { prompt } = body;

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt es requerido' }, { status: 400 });
        }

        console.log('🤖 Generando CV con GPT-4...');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: `Información del usuario:\n"${prompt}"\n\nGenera el JSON del CV estructurado y mejorado profesionalmente.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 2500,
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error('No se generó contenido');
        }

        // Intentar parsear el JSON (limpiando posibles backticks de markdown)
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const cvData = JSON.parse(jsonString);

        // Añadir IDs únicos si faltan (por seguridad)
        cvData.experience = cvData.experience.map((item: any, i: number) => ({ ...item, id: item.id || `exp-${i}-${Date.now()}` }));
        cvData.education = cvData.education.map((item: any, i: number) => ({ ...item, id: item.id || `edu-${i}-${Date.now()}` }));
        cvData.courses = cvData.courses.map((item: any, i: number) => ({ ...item, id: item.id || `course-${i}-${Date.now()}` }));

        // Asegurar imagen vacía para que el usuario suba la suya
        if (cvData.personalInfo) cvData.personalInfo.imageUrl = "";

        return NextResponse.json({ success: true, data: cvData });

    } catch (error: any) {
        console.error('❌ Error generando CV:', error);
        return NextResponse.json(
            { error: 'Error al generar el CV', details: error.message },
            { status: 500 }
        );
    }
}
