import { DimensionId, DimensionScore, GrowIqResult } from '../types/grow-iq';
import { DIMENSIONS, QUESTIONS } from './questions';

export function calculateScore(value: number, type: 'direct' | 'inverse'): number {
  if (type === 'direct') {
    return value;
  }
  // Inverse: 0 -> 100, 25 -> 75, 50 -> 50, 75 -> 25, 100 -> 0
  return 100 - value;
}

export function calculateGrowIq(answers: Record<string, number>): GrowIqResult {
  const dimensionScoresMap: Record<DimensionId, { total: number; count: number }> = {
    procesos_organizacion: { total: 0, count: 0 },
    datos_indicadores: { total: 0, count: 0 },
    automatizacion_integracion: { total: 0, count: 0 },
    gestion_comercial: { total: 0, count: 0 },
    tecnologia_ia: { total: 0, count: 0 },
    escalabilidad: { total: 0, count: 0 },
  };

  QUESTIONS.forEach(q => {
    if (answers[q.id] !== undefined) {
      const score = calculateScore(answers[q.id], q.type);
      dimensionScoresMap[q.dimensionId].total += score;
      dimensionScoresMap[q.dimensionId].count += 1;
    }
  });

  const dimensionScores: DimensionScore[] = DIMENSIONS.map(dim => {
    const data = dimensionScoresMap[dim.id];
    const averageScore = data.count > 0 ? data.total / data.count : 0;
    const weightedScore = averageScore * (dim.weight / 100);
    return {
      dimensionId: dim.id,
      name: dim.name,
      score: Math.round(averageScore),
      weightedScore: weightedScore
    };
  });

  const totalScore = Math.round(dimensionScores.reduce((sum, dim) => sum + dim.weightedScore, 0));

  let maturityLevel = '';
  let maturityDescription = '';

  if (totalScore <= 25) {
    maturityLevel = 'Operación vulnerable';
    maturityDescription = 'La empresa depende fuertemente de tareas manuales, personas clave y conocimiento no documentado.';
  } else if (totalScore <= 45) {
    maturityLevel = 'Empresa reactiva';
    maturityDescription = 'La empresa funciona, pero suele responder a problemas cuando ya ocurrieron y tiene baja visibilidad de sus procesos.';
  } else if (totalScore <= 65) {
    maturityLevel = 'En proceso de ordenamiento';
    maturityDescription = 'La empresa cuenta con algunas herramientas y procesos definidos, aunque todavía existen oportunidades relevantes de integración y automatización.';
  } else if (totalScore <= 80) {
    maturityLevel = 'Empresa digitalmente preparada';
    maturityDescription = 'La organización cuenta con procesos relativamente sólidos, utiliza datos y posee buenas condiciones para escalar mediante tecnología.';
  } else {
    maturityLevel = 'Operación inteligente';
    maturityDescription = 'La empresa presenta un alto nivel de integración, medición, automatización y capacidad de crecimiento.';
  }

  // Sort dimensions by score for strengths and priority areas
  const sortedDimensions = [...dimensionScores].sort((a, b) => b.score - a.score);
  
  const topStrengths = sortedDimensions.slice(0, 3);
  const priorityAreas = [...sortedDimensions].reverse().slice(0, 3);

  return {
    totalScore,
    maturityLevel,
    maturityDescription,
    dimensionScores,
    topStrengths,
    priorityAreas
  };
}
