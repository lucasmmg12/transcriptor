'use client';

import { useAdminStore } from '../../../lib/store';
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle2, Users,
  Calendar, ArrowRight, Activity, BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { tasks, leads, projects, meetings, team } = useAdminStore();
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

  const kpis = [
    { label: 'Completadas', value: `${completedTasks}/${totalTasks}`, sub: `${completionRate}%`, icon: CheckCircle2, grad: 'from-emerald-500 to-emerald-600' },
    { label: 'En Progreso', value: `${inProgressTasks}`, sub: `${blockedTasks} bloqueadas`, icon: Activity, grad: 'from-blue-500 to-blue-600' },
    { label: 'Vencidas', value: `${overdueTasks}`, sub: 'requieren atención', icon: AlertTriangle, grad: 'from-red-500 to-red-600' },
    { label: 'Pipeline CRM', value: `${activeLeads} leads`, sub: pipelineValue > 0 ? `$${pipelineValue.toLocaleString('es-AR')}` : 'Sin leads', icon: TrendingUp, grad: 'from-violet-500 to-violet-600' },
  ];

  const statusColor = (s: string) => {
    const map: Record<string, string> = { 'Completado': 'bg-emerald-100 text-emerald-700', 'En curso': 'bg-blue-100 text-blue-700', 'Bloqueado': 'bg-red-100 text-red-700', 'Pendiente': 'bg-gray-100 text-gray-600' };
    return map[s] || 'bg-gray-100 text-gray-600';
  };
  const prioColor = (p: string) => p === 'Alta' ? 'bg-red-500' : p === 'Media' ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{today.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{k.label}</span>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${k.grad} flex items-center justify-center shadow-lg`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><BarChart3 size={18} className="text-emerald-500" /> Avance por Fase</h3>
          </div>
          <div className="p-5 space-y-4">
            {phaseStats.map((p) => (
              <div key={p.phase} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 truncate">{p.phase}</span>
                  <span className="text-xs font-bold text-gray-500 ml-2">{p.completed}/{p.total} ({p.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-3"><Users size={16} className="text-blue-500" /> Equipo</h3>
            {team.filter((m) => m.active).map((m) => (
              <div key={m.id} className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">{m.name[0]}</div>
                <div><p className="text-sm font-medium text-gray-800">{m.name}</p><p className="text-xs text-gray-400">{m.role}</p></div>
              </div>
            ))}
            <Link href="/admin/team" className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2 hover:text-emerald-700"><span>Ver equipo</span> <ArrowRight size={12} /></Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-3"><Calendar size={16} className="text-violet-500" /> Reuniones</h3>
            {meetings.length > 0 ? meetings.slice(0, 3).map((m) => (
              <div key={m.id} className="text-sm mb-2"><p className="font-medium text-gray-700">{m.topic}</p><p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('es-AR')}</p></div>
            )) : <p className="text-sm text-gray-400">Sin reuniones registradas</p>}
            <Link href="/admin/meetings" className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2 hover:text-emerald-700"><span>Ver reuniones</span> <ArrowRight size={12} /></Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div><h3 className="font-bold text-gray-800 flex items-center gap-2"><Clock size={18} className="text-amber-500" /> Próximos 7 Días</h3><p className="text-xs text-gray-400 mt-0.5">{next7Days.length} tareas</p></div>
          <Link href="/admin/tasks" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">Ver todas <ArrowRight size={12} /></Link>
        </div>
        {next7Days.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {next7Days.slice(0, 8).map((t) => {
              const dl = Math.ceil((new Date(t.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={t.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50/50">
                  <div className={`w-2 h-2 rounded-full ${prioColor(t.priority)}`} />
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 truncate">{t.title}</p><p className="text-xs text-gray-400">{t.responsible}</p></div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor(t.status)}`}>{t.status}</span>
                  <span className={`text-xs font-bold ${dl <= 1 ? 'text-red-500' : dl <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>{dl === 0 ? 'Hoy' : dl === 1 ? 'Mañana' : `${dl}d`}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400"><CheckCircle2 size={40} className="mx-auto mb-2 opacity-30" /><p className="font-medium">Sin tareas próximas</p></div>
        )}
      </div>
    </div>
  );
}
