export type DimensionId = 
  | 'procesos_organizacion'
  | 'datos_indicadores'
  | 'automatizacion_integracion'
  | 'gestion_comercial'
  | 'tecnologia_ia'
  | 'escalabilidad';

export interface Dimension {
  id: DimensionId;
  name: string;
  weight: number; // Porcentaje, e.g., 22 para 22%
}

export type ScoreType = 'direct' | 'inverse';

export interface Question {
  id: string;
  dimensionId: DimensionId;
  text: string;
  type: ScoreType;
  order: number;
}

export interface Answer {
  questionId: string;
  value: 0 | 25 | 50 | 75 | 100;
}

export interface OpenQuestion {
  id: string;
  text: string;
  answer: string;
}

export interface GrowIqFormState {
  // Datos de la empresa
  companyName: string;
  industry: string;
  customIndustry?: string;
  province: string;
  country: string;
  employees: string;
  antiquity: string;
  role: string;
  revenue?: string;
  cuit?: string;

  // Respuestas del cuestionario
  answers: Record<string, number>; // questionId -> value (0-100)
  
  // Preguntas abiertas
  openAnswers: Record<string, string>; // openQuestionId -> text

  // Datos de contacto final
  fullName: string;
  email: string;
  whatsapp: string;
  privacyAccepted: boolean;
}

export interface DimensionScore {
  dimensionId: DimensionId;
  name: string;
  score: number; // 0-100
  weightedScore: number; 
}

export interface GrowIqResult {
  totalScore: number;
  maturityLevel: string;
  maturityDescription: string;
  dimensionScores: DimensionScore[];
  topStrengths: DimensionScore[];
  priorityAreas: DimensionScore[];
}

export interface AIRecommendation {
  executiveSummary: string;
  mainStrengths: string[];
  priorityAreas: {
    area: string;
    reason: string;
    recommendation: string;
  }[];
  actionPlan: {
    '30Days': string[];
    '60Days': string[];
    '90Days': string[];
  };
  suggestedSolution: string;
}

export interface GrowIqLead {
  id: string;
  token: string;
  status: 'started' | 'contact_captured' | 'completed' | 'abandoned' | 'meeting_requested';
  createdAt: string;
  completedAt?: string;
  
  // Datos
  fullName: string;
  email: string;
  whatsapp: string;
  companyName: string;
  role: string;
  industry: string;
  province: string;
  country: string;
  employees: string;
  antiquity: string;
  
  // Resultados
  answers: Record<string, number>;
  openAnswers: Record<string, string>;
  
  totalScore?: number;
  dimensionScores?: any;
  maturityLevel?: string;
  
  // IA
  aiRecommendations?: AIRecommendation;
  deterministicRecommendations?: any;
}
