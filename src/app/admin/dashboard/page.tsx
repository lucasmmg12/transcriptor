'use client';

import { useAdminStore } from '../../../lib/store';
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle2, Users,
  Calendar, ArrowRight, Activity, BarChart3, FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { tasks, leads, projects, meetings, team, proposals } = useAdminStore();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completado').length;
  const inProgressTasks = tasks.filter((t) => ['En curso', 'En análisis', 'En revisión'].includes(t.status)).length;
  const blockedTasks = tasks.filter((t) => t.status === 'Bloqueado').length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Completado' || t.status === 'Cancelado') return false;
    return t.targetDate < todayStr;
  }).length;
  const next7Days = tasks.filter((t) => {
    if (t.status === 'Completado' || t.status === 'Cancelado') return false;
    const diff = (new Date(t.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const phases = Array.from(new Set(tasks.map((t) => t.phase)));
  const phaseStats = phases.map((phase) => {
    const pt = tasks.filter((t) => t.phase === phase);
    const c = pt.filter((t) => t.status === 'Completado').length;
    return { phase, total: pt.length, completed: c, pct: pt.length > 0 ? Math.round((c / pt.length) * 100) : 0 };
  });

  const activeLeads = leads.filter((l) => !['Cerrado Ganado', 'Cerrado Perdido'].includes(l.stage)).length;
  const pipelineValue = leads.filter((l) => !['Cerrado Ganado', 'Cerrado Perdido'].includes(l.stage)).reduce((s, l) => s + l.estimatedValue, 0);
  const totalProposalValue = proposals.reduce((s, p) => s + p.valueArs, 0);

  const kpis = [
    { label: 'Completadas', value: `${completedTasks}/${totalTasks}`, sub: `${completionRate}% Tasa de éxito`, icon: CheckCircle2, grad: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-400' },
    { label: 'En Progreso', value: `${inProgressTasks}`, sub: `${blockedTasks} bloqueadas`, icon: Activity, grad: 'from-blue-500 to-blue-600', textColor: 'text-blue-400' },
    { label: 'Propuestas IA', value: `${proposals.length}`, sub: totalProposalValue > 0 ? `$${totalProposalValue.toLocaleString('es-AR')}` : 'Sin propuestas', icon: FileText, grad: 'from-indigo-500 to-indigo-600', textColor: 'text-indigo-400' },
    { label: 'Pipeline CRM', value: `${activeLeads} leads`, sub: pipelineValue > 0 ? `$${pipelineValue.toLocaleString('es-AR')}` : 'Sin leads activos', icon: TrendingUp, grad: 'from-violet-500 to-violet-600', textColor: 'text-violet-400' },
  ];

  const statusColor = (s: string) => {
    const map: Record<string, string> = { 
      'Completado': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', 
      'En curso': 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 
      'Bloqueado': 'bg-red-500/10 text-red-400 border border-red-500/20', 
      'Pendiente': 'bg-gray-800 text-gray-400 border border-gray-700/50' 
    };
    return map[s] || 'bg-gray-800 text-gray-400 border border-gray-700/50';
  };
  const prioColor = (p: string) => p === 'Alta' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : p === 'Media' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Dashboard Ejecutivo
        </h1>
        <p className="text-gray-400 text-sm mt-1 capitalize">
          {today.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white/[0.03] rounded-2xl border border-white/10 p-5 hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{k.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${k.grad} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{k.value}</p>
              <p className="text-xs text-gray-500 mt-1.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-400" />
            <h3 className="font-bold text-white text-base">Avance de Procesos por Fase</h3>
          </div>
          <div className="p-6 space-y-5">
            {phaseStats.map((p) => (
              <div key={p.phase} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-200 truncate pr-4">{p.phase}</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono flex-shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                    {p.completed}/{p.total} ({p.pct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${p.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm mb-4">
              <Users size={16} className="text-emerald-400" /> Miembros del Equipo
            </h3>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {team.filter((m) => m.active).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {m.name[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-200 truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 mt-4 pt-3">
              <Link href="/admin/team" className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:text-emerald-300 transition-colors w-max">
                <span>Ver equipo completo</span> 
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm mb-4">
              <Calendar size={16} className="text-emerald-400" /> Próximas Reuniones
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {meetings.length > 0 ? meetings.slice(0, 3).map((m) => (
                <div key={m.id} className="text-sm border-l-2 border-emerald-500/40 pl-3 py-0.5">
                  <p className="font-semibold text-gray-200 truncate">{m.topic}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{new Date(m.date).toLocaleDateString('es-AR')}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-500 italic py-2">Sin reuniones programadas</p>
              )}
            </div>
            <div className="border-t border-white/5 mt-4 pt-3">
              <Link href="/admin/meetings" className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:text-emerald-300 transition-colors w-max">
                <span>Ver calendario de reuniones</span> 
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm mb-4">
              <FileText size={16} className="text-indigo-400" /> Últimas Propuestas (IA)
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {proposals.length > 0 ? proposals.slice(0, 3).map((p) => (
                <div key={p.id} className="text-sm border-l-2 border-indigo-500/40 pl-3 py-0.5">
                  <p className="font-semibold text-gray-200 truncate">{p.clientName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{p.projectName}</p>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold mt-0.5">
                    ${Number(p.valueArs).toLocaleString('es-AR')} ARS
                  </p>
                </div>
              )) : (
                <p className="text-xs text-gray-500 italic py-2">Sin propuestas generadas</p>
              )}
            </div>
            <div className="border-t border-white/5 mt-4 pt-3">
              <Link href="/admin/propuestas" className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors w-max">
                <span>Ir a Propuestas</span> 
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              <Clock size={18} className="text-amber-400" /> Próximas Entregas (Siguientes 7 días)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{next7Days.length} tareas pendientes de proceso</p>
          </div>
          <Link href="/admin/tasks" className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors">
            Ver matriz completa <ArrowRight size={12} />
          </Link>
        </div>

        {next7Days.length > 0 ? (
          <div className="divide-y divide-white/5">
            {next7Days.slice(0, 8).map((t) => {
              const dl = Math.ceil((new Date(t.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={t.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${prioColor(t.priority)}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate">{t.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.responsible}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                    <span className={`text-xs font-bold font-mono px-2 py-1 rounded bg-white/5 border border-white/10 min-w-[50px] text-center ${
                      dl <= 1 ? 'text-red-400 border-red-500/20' : dl <= 3 ? 'text-amber-400 border-amber-500/20' : 'text-gray-400'
                    }`}>
                      {dl === 0 ? 'Hoy' : dl === 1 ? 'Mañ' : `${dl}d`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <CheckCircle2 size={44} className="mx-auto mb-3 opacity-20 text-emerald-400" />
            <p className="font-semibold text-gray-300">¡Todo al día!</p>
            <p className="text-xs text-gray-500 mt-1">No hay tareas programadas para vencer en los próximos 7 días.</p>
          </div>
        )}
      </div>
    </div>
  );
}
