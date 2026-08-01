import { AIRecommendation, DimensionScore, GrowIqResult } from '../types/grow-iq';

export function getDeterministicRecommendations(result: GrowIqResult): AIRecommendation {
  const { totalScore, priorityAreas } = result;

  const aiRecommendation: AIRecommendation = {
    executiveSummary: `El diagnóstico de Grow IQ muestra un nivel de madurez operativa con un puntaje de ${totalScore}/100. Esto ubica a la empresa en el nivel de "${result.maturityLevel}". Se han identificado fortalezas importantes, pero también áreas críticas que requieren atención inmediata para asegurar la escalabilidad y eficiencia.`,
    mainStrengths: result.topStrengths.map(s => `Buen desempeño en ${s.name} con un puntaje de ${s.score}/100.`),
    priorityAreas: priorityAreas.map(p => {
      let recommendation = '';
      if (p.dimensionId === 'automatizacion_integracion') {
        recommendation = 'Identificar tareas repetitivas, eliminar doble carga de datos, centralizar solicitudes y aprobaciones e implementar alertas automáticas.';
      } else if (p.dimensionId === 'datos_indicadores') {
        recommendation = 'Definir indicadores críticos, unificar fuentes de información, automatizar reportes y crear dashboards de gestión.';
      } else if (p.dimensionId === 'procesos_organizacion') {
        recommendation = 'Documentar procesos clave, definir responsabilidades claras y establecer procedimientos estándar para evitar dependencias de personas únicas.';
      } else if (p.dimensionId === 'gestion_comercial') {
        recommendation = 'Implementar o mejorar el CRM, asegurar registro de todas las oportunidades y crear flujos automáticos de seguimiento de prospectos.';
      } else if (p.dimensionId === 'tecnologia_ia') {
        recommendation = 'Evaluar procesos donde la IA pueda aportar valor, establecer lineamientos de uso y proteger información crítica.';
      } else if (p.dimensionId === 'escalabilidad') {
        recommendation = 'Reducir la dependencia operativa de dueños/gerentes y diseñar la estructura para soportar un mayor volumen sin duplicar costos.';
      }

      return {
        area: p.name,
        reason: `Puntaje bajo (${p.score}/100) que representa un cuello de botella.`,
        recommendation
      };
    }),
    actionPlan: {
      '30Days': [
        `Analizar a fondo el área de ${priorityAreas[0]?.name || 'operaciones'}.`,
        'Mapear los procesos críticos actuales para encontrar ineficiencias.',
        'Definir 3 métricas clave (KPIs) para empezar a medir.'
      ],
      '60Days': [
        'Implementar una herramienta de centralización o automatización rápida.',
        'Capacitar al equipo clave en los nuevos flujos de trabajo.',
        `Abordar los problemas en el área de ${priorityAreas[1]?.name || 'gestión'}.`
      ],
      '90Days': [
        'Revisar el impacto de las automatizaciones implementadas.',
        'Documentar los procesos mejorados.',
        'Planificar el siguiente ciclo de optimización tecnológica.'
      ]
    },
    suggestedSolution: 'Se recomienda agendar una sesión estratégica con Grow Labs para diseñar un plan de implementación tecnológica a medida que resuelva estos cuellos de botella de forma definitiva.'
  };

  return aiRecommendation;
}
