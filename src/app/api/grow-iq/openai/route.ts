import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openai';
import { AIRecommendation } from '@/lib/types/grow-iq';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token es requerido' }, { status: 400 });
    }

    // Buscar el diagnóstico en la base de datos
    const { data: diagnostic, error: fetchError } = await supabase
      .from('grow_iq_diagnostics')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !diagnostic) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 });
    }

    // Si ya tiene recomendaciones de IA, devolverlas
    if (diagnostic.ai_recommendations) {
      return NextResponse.json({
        success: true,
        aiRecommendations: diagnostic.ai_recommendations
      });
    }

    // Preparar el prompt para OpenAI
    const prompt = `
Eres un consultor experto en transformación digital y operaciones de empresas.
A continuación te presento los resultados del diagnóstico "Grow IQ" de una empresa.
El Grow IQ mide la madurez operativa, digital y tecnológica.

**Datos de la empresa:**
- Nombre: ${diagnostic.company_name}
- Industria: ${diagnostic.industry}
- Tamaño: ${diagnostic.employees} empleados
- Rol de quien responde: ${diagnostic.role}

**Resultados del diagnóstico:**
- Puntaje Total: ${diagnostic.total_score}/100
- Nivel de Madurez: ${diagnostic.maturity_level}
- Puntajes por Dimensión:
${JSON.stringify(diagnostic.dimension_scores, null, 2)}

**Problemas declarados por el usuario:**
${JSON.stringify(diagnostic.open_answers, null, 2)}

Genera recomendaciones personalizadas para esta empresa estructuradas exactamente en el siguiente formato JSON:
{
  "executiveSummary": "Resumen ejecutivo del estado de la empresa (max 3 oraciones).",
  "mainStrengths": ["Fortaleza 1", "Fortaleza 2"],
  "priorityAreas": [
    {
      "area": "Nombre del área/dimensión",
      "reason": "Por qué es prioritario (max 2 oraciones)",
      "recommendation": "Recomendación específica"
    }
  ],
  "actionPlan": {
    "30Days": ["Paso 1", "Paso 2"],
    "60Days": ["Paso 1", "Paso 2"],
    "90Days": ["Paso 1", "Paso 2"]
  },
  "suggestedSolution": "Sugerencia de cómo Grow Labs puede ayudar (max 2 oraciones)."
}
`;

    if (!process.env.OPENAI_API_KEY) {
       console.warn('OPENAI_API_KEY no configurada. Retornando recomendaciones determinísticas.');
       return NextResponse.json({
         success: true,
         aiRecommendations: diagnostic.deterministic_recommendations,
         fallback: true
       });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const aiContent = completion.choices[0].message.content;
    
    if (!aiContent) {
      throw new Error("No response from OpenAI");
    }

    const aiRecommendations: AIRecommendation = JSON.parse(aiContent);

    // Guardar recomendaciones en la base de datos
    await supabase
      .from('grow_iq_diagnostics')
      .update({ ai_recommendations: aiRecommendations })
      .eq('token', token);

    return NextResponse.json({
      success: true,
      aiRecommendations
    });

  } catch (error) {
    console.error('Grow IQ OpenAI API Error:', error);
    // Si falla OpenAI, fallar silenciosamente para el usuario y que frontend use el deterministic
    return NextResponse.json({ error: 'Error procesando inteligencia artificial' }, { status: 500 });
  }
}
