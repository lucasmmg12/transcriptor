import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Verificar API Key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { leadId, projectId, notes, valueArs, clientNameCustom, projectNameCustom } = body;

    let clientName = clientNameCustom || 'Cliente';
    let projectName = projectNameCustom || 'Plataforma de Gestión';
    let leadNotes = '';
    let projectNotes = '';
    let historicalContext = '';

    // 1. Obtener contexto de Lead
    if (leadId) {
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (lead) {
        clientName = lead.company || lead.contactName;
        projectName = lead.interestedService || projectName;
        leadNotes = `
- Cliente (Contacto): ${lead.contactName}
- Servicio interesado: ${lead.interestedService}
- Fricciones/Notas del Lead: ${lead.notes}
- Valor Estimado inicial: $${Number(lead.estimatedValue).toLocaleString('es-AR')} ARS
- Próxima Acción planificada: ${lead.nextAction || 'Ninguna'}
`;
      }
    }

    // 2. Obtener contexto de Proyecto
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (project) {
        clientName = project.client;
        projectName = project.name;
        projectNotes = `
- Proyecto actual: ${project.name}
- Descripción: ${project.description}
- Estado del proyecto: ${project.status}
- Avance: ${project.progress}%
- Valor del proyecto: $${Number(project.value).toLocaleString('es-AR')} ARS
- Notas del proyecto: ${project.notes || 'Ninguna'}
`;
      }
    }

    // 3. Buscar reuniones previas para el cliente o proyecto (para sumar contexto)
    const { data: meetings } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: false })
      .limit(5);

    let meetingsContext = '';
    if (meetings && meetings.length > 0) {
      // Filtrar reuniones que puedan mencionar al cliente
      const relevantMeetings = meetings.filter(m => 
        m.topic.toLowerCase().includes(clientName.toLowerCase()) || 
        (m.notes && m.notes.toLowerCase().includes(clientName.toLowerCase()))
      );

      if (relevantMeetings.length > 0) {
        meetingsContext = relevantMeetings.map(m => `
* Reunión del ${m.date} - Tema: ${m.topic}
  - Decisiones tomadas: ${JSON.stringify(m.decisions)}
  - Próximos pasos: ${m.nextSteps || 'Ninguno'}
  - Notas de reunión: ${m.notes || 'Ninguna'}
`).join('\n');
      }
    }

    // 4. Buscar propuestas comerciales anteriores para este cliente (memoria acumulada)
    const { data: pastProposals } = await supabase
      .from('proposals')
      .select('title, clientName, projectName, object, valueArs, mainIdea')
      .eq('clientName', clientName)
      .order('createdAt', { ascending: false })
      .limit(3);

    if (pastProposals && pastProposals.length > 0) {
      historicalContext = pastProposals.map(p => `
* Propuesta comercial previa: "${p.title}"
  - Objeto: ${p.object}
  - Idea central previa: ${p.mainIdea}
  - Valor total cotizado: $${Number(p.valueArs).toLocaleString('es-AR')} ARS
`).join('\n');
    }

    // 5. Armar prompt para OpenAI
    const systemPrompt = `Eres Lucas Marinero, Director Comercial y Diseñador de Soluciones en Grow Labs.
Tu empresa no hace software, ordenas procesos y escalas negocios.
Vas a generar una Propuesta y Justificación Técnico-Comercial formal en formato de JSON estricto para un cliente.

**Filosofía Grow Labs:**
- No vendemos desarrollo de software aislado. Ordenamos métodos, flujos de trabajo, y escala de negocios para que la empresa opere con previsibilidad.
- Explicamos la justificación metodológica: por qué digitalizar ahorra intermediarios y elimina fricción humana.
- El tono debe ser altamente profesional, persuasivo, sobrio y estratégico (español de Argentina, de vos: "Ingresá", "Gestioná").

**Estructura de Salida Requerida (JSON Estricto):**
{
  "title": "Justificación Técnica y Comercial para la Evolución Integral de la Plataforma de Gestión de [Cliente]",
  "clientName": "[Nombre del Cliente/Empresa]",
  "projectName": "[Nombre del Proyecto]",
  "object": "Justificación de módulos complementarios y evolución integral de la plataforma",
  "location": "San Juan, Argentina",
  "mainIdea": "[Resumen ejecutivo potente de 2 o 3 líneas sobre el porqué de la inversión y cómo ordenará la empresa a largo plazo]",
  "valueArs": ${valueArs ? Number(valueArs) : 9800000},
  "detailsJson": {
    "objectives": [
      "[Objetivo estratégico 1: p.ej. Unificar bases de datos para evitar doble carga]",
      "[Objetivo estratégico 2: p.ej. Digitalizar partes diarios de obra con firma QR dinámica]"
    ],
    "scope": [
      "[Alcance de transición e infraestructura]",
      "[Alcance de soporte estratégico y consultoría mensual]"
    ],
    "investmentDetails": [
      { "concept": "Módulo 1 ya ofertado", "detail": "Implementación del núcleo de administración y legajos..." },
      { "concept": "Evolución Integral Módulos 2 y 3", "detail": "Despliegue de logística de flotas, compras e IVA, conciliación automatizada..." }
    ]
  }
}

**Contexto del negocio de este cliente:**
${leadNotes ? `[INFORMACIÓN DEL CRM / LEAD]\n${leadNotes}` : ''}
${projectNotes ? `[INFORMACIÓN DEL PROYECTO ACTUAL]\n${projectNotes}` : ''}
${meetingsContext ? `[REUNIONES RECIENTES CON EL CLIENTE]\n${meetingsContext}` : ''}
${historicalContext ? `[HISTORIAL DE PROPUESTAS ANTERIORES PARA ESTE CLIENTE (MEMORIA ACUMULADA)]\n${historicalContext}` : 'No hay propuestas comerciales anteriores registradas para este cliente.'}

[NOTAS COMPLEMENTARIAS DEL OPERADOR]
${notes || 'Ninguna especificada.'}

Generá la propuesta en base a esta información. Sé específico con los módulos (Compras, Finanzas, Logística, WBS) según corresponda. Retorná únicamente el JSON estricto.`;

    console.log('🤖 Solicitando propuesta a OpenAI GPT-4o con contexto acumulado...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generá la propuesta comercial técnico-comercial estructurada en JSON según los datos brindados.' }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const resultText = completion.choices[0].message.content || '{}';
    const proposalData = JSON.parse(resultText);

    // Guardar propuesta en base de datos si la respuesta es válida
    const proposalId = 'prop_' + Math.random().toString(36).substring(2, 11);
    const dateFormatted = new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const newProposal = {
      id: proposalId,
      title: proposalData.title || 'Propuesta Técnico-Comercial',
      clientName: proposalData.clientName || clientName,
      projectName: proposalData.projectName || projectName,
      object: proposalData.object || 'Justificación de módulos complementarios',
      date: dateFormatted,
      location: proposalData.location || 'San Juan, Argentina',
      mainIdea: proposalData.mainIdea || 'Propuesta de evolución integral',
      valueArs: Number(proposalData.valueArs) || Number(valueArs) || 0,
      detailsJson: proposalData.detailsJson || { objectives: [], scope: [], investmentDetails: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Guardar en Supabase
    const { error: dbError } = await supabase
      .from('proposals')
      .insert([newProposal]);

    if (dbError) {
      console.error('Error al guardar propuesta en base de datos:', dbError);
      // Aunque falle guardar, devolvemos la propuesta generada para no arruinar la experiencia
    }

    return NextResponse.json({
      success: true,
      proposal: newProposal
    });

  } catch (error: any) {
    console.error('❌ Error al generar propuesta comercial:', error);
    return NextResponse.json(
      { error: 'Error al generar propuesta', details: error.message || 'Desconocido' },
      { status: 500 }
    );
  }
}
