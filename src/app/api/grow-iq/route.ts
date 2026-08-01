import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateGrowIq } from '@/lib/grow-iq/scoring';
import { getDeterministicRecommendations } from '@/lib/grow-iq/recommendations';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      industry,
      customIndustry,
      province,
      country,
      employees,
      antiquity,
      role,
      revenue,
      cuit,
      answers,
      openAnswers,
      fullName,
      email,
      whatsapp,
    } = body;

    // Calcular puntajes
    const result = calculateGrowIq(answers);

    // Obtener recomendaciones determinísticas (fallback inmediato)
    const deterministicRecommendations = getDeterministicRecommendations(result);

    const actualIndustry = industry === 'Otro' && customIndustry ? customIndustry : industry;

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('grow_iq_diagnostics')
      .insert({
        status: 'completed',
        full_name: fullName,
        email,
        whatsapp,
        company_name: companyName,
        role,
        industry: actualIndustry,
        province,
        country,
        employees,
        antiquity,
        answers,
        open_answers: openAnswers,
        total_score: result.totalScore,
        dimension_scores: result.dimensionScores,
        maturity_level: result.maturityLevel,
        deterministic_recommendations: deterministicRecommendations,
        completed_at: new Date().toISOString()
      })
      .select('token')
      .single();

    if (error) {
      console.error('Error inserting diagnostic:', error);
      return NextResponse.json({ error: 'Error al guardar el diagnóstico' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      token: data.token,
      result,
      deterministicRecommendations
    });

  } catch (error) {
    console.error('Grow IQ API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
