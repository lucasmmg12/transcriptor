// ==========================================
// GROW LABS MANAGEMENT SYSTEM — TYPES
// ==========================================

// === AUTH ===
export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
}

// === TASKS / MATRIX CONTROL ===
export type TaskPhase =
  | 'Fase 1 - Orden estratégico'
  | 'Fase 2 - Modelo de negocio'
  | 'Fase 3 - Sistema comercial'
  | 'Fase 4 - Sistema operativo'
  | 'Fase 5 - Gestión interna'
  | 'Fase 6 - Plan 30/60/90';

export type TaskType = 'Reunión' | 'Documento' | 'Decisión' | 'Proceso' | 'Plantilla' | 'Guion' | 'Checklist' | 'Tablero' | 'Política' | 'Rutina' | 'Registro' | 'Indicadores' | 'Plan' | 'Matriz';

export type TaskStatus = 'Pendiente' | 'En análisis' | 'En curso' | 'En revisión' | 'Completado' | 'Bloqueado' | 'Postergado' | 'Cancelado';

export type TaskPriority = 'Alta' | 'Media' | 'Baja';

export type TaskResponsible = 'Gustavo' | 'Lucas' | 'Lucas + Gustavo' | 'Equipo' | 'Cliente';

export interface Task {
  id: number;
  phase: TaskPhase;
  type: TaskType;
  title: string;
  expectedResult: string;
  responsible: TaskResponsible;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  targetDate: string;
  closeDate?: string;
  progress: number; // 0, 25, 50, 75, 100
  observations?: string;
}

// === LEADS / CRM ===
export type LeadStage = 'Nuevo' | 'Contactado' | 'Diagnóstico' | 'Propuesta' | 'Negociación' | 'Cerrado Ganado' | 'Cerrado Perdido';

export type LeadSource = 'Referido' | 'Web' | 'Redes Sociales' | 'Evento' | 'WhatsApp' | 'Otro';

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: LeadStage;
  source: LeadSource;
  interestedService: string;
  estimatedValue: number;
  notes: string;
  nextAction?: string;
  nextActionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// === PROJECTS ===
export type ProjectStatus = 'Onboarding' | 'En desarrollo' | 'En revisión' | 'Entregado' | 'En mantenimiento' | 'Pausado' | 'Cancelado';

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  value: number;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  assignedTo: string[];
  milestones: ProjectMilestone[];
  notes?: string;
  createdAt: string;
}

// === TEAM ===
export type TeamRole = 'Director' | 'Desarrollador' | 'Diseñador' | 'Comercial' | 'Consultor' | 'Freelancer';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate: string;
  active: boolean;
  skills: string[];
  currentProjects: string[];
}

// === MEETINGS ===
export type MeetingType = 'Semanal' | 'Estratégica' | 'Comercial' | 'Proyecto' | 'Interna';

export type MeetingStatus = 'Programada' | 'En curso' | 'Completada' | 'Cancelada';

export interface Decision {
  id: string;
  description: string;
  responsible: string;
  deadline?: string;
  status: 'Pendiente' | 'En curso' | 'Completada';
}

export interface Meeting {
  id: string;
  date: string;
  type: MeetingType;
  topic: string;
  attendees: string[];
  decisions: Decision[];
  nextSteps: string;
  commitmentDate?: string;
  status: MeetingStatus;
  notes?: string;
}
