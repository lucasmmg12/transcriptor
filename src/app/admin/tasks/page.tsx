'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Task, TaskPhase, TaskStatus, TaskPriority, TaskResponsible, TaskType } from '../../../lib/types';
import { ListChecks, Plus, Filter, Search, X, Edit3, Trash2, ChevronDown, Save } from 'lucide-react';

const PHASES: TaskPhase[] = ['Fase 1 - Orden estratégico', 'Fase 2 - Modelo de negocio', 'Fase 3 - Sistema comercial', 'Fase 4 - Sistema operativo', 'Fase 5 - Gestión interna', 'Fase 6 - Plan 30/60/90'];
const STATUSES: TaskStatus[] = ['Pendiente', 'En análisis', 'En curso', 'En revisión', 'Completado', 'Bloqueado', 'Postergado', 'Cancelado'];
const PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja'];
const RESPONSIBLES: TaskResponsible[] = ['Gustavo', 'Lucas', 'Lucas + Gustavo', 'Equipo', 'Cliente'];
const TYPES: TaskType[] = ['Reunión', 'Documento', 'Decisión', 'Proceso', 'Plantilla', 'Guion', 'Checklist', 'Tablero', 'Política', 'Rutina', 'Registro', 'Indicadores', 'Plan', 'Matriz'];
const PROGRESSES = [0, 25, 50, 75, 100];

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterPhase, setFilterPhase] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterResponsible, setFilterResponsible] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<Partial<Task>>({});

  const today = new Date().toISOString().split('T')[0];

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPhase && t.phase !== filterPhase) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterResponsible && t.responsible !== filterResponsible) return false;
    return true;
  });

  const semaforo = (t: Task) => {
    if (t.status === 'Completado') return { color: 'bg-emerald-500', label: 'OK' };
    if (t.status === 'Bloqueado') return { color: 'bg-red-500', label: 'Bloq' };
    if (t.status === 'Cancelado') return { color: 'bg-gray-500', label: '—' };
    const diff = Math.ceil((new Date(t.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]', label: `${Math.abs(diff)}d atrás` };
    if (diff <= 3) return { color: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]', label: `${diff}d` };
    return { color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', label: `${diff}d` };
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { 
      'Completado': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', 
      'En curso': 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 
      'En análisis': 'bg-amber-500/10 text-amber-400 border border-amber-500/20', 
      'En revisión': 'bg-violet-500/10 text-violet-400 border border-violet-500/20', 
      'Bloqueado': 'bg-red-500/10 text-red-400 border border-red-500/20', 
      'Postergado': 'bg-orange-500/10 text-orange-400 border border-orange-500/20', 
      'Cancelado': 'bg-gray-800 text-gray-400 border border-gray-700/50', 
      'Pendiente': 'bg-gray-800 text-gray-300 border border-gray-700/50' 
    };
    return m[s] || 'bg-gray-800 text-gray-300 border border-gray-700/50';
  };

  const prioColor = (p: string) => p === 'Alta' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : p === 'Media' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-green-400 bg-green-500/10 border border-green-500/20';

  const openNew = () => {
    setEditingTask(null);
    setForm({ phase: PHASES[0], type: TYPES[0], status: 'Pendiente', priority: 'Media', responsible: 'Gustavo', progress: 0, startDate: today, targetDate: today });
    setShowModal(true);
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setForm({ ...t });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.phase) return;
    if (editingTask) {
      updateTask(editingTask.id, form);
    } else {
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      addTask({ ...form, id: newId } as Task);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><ListChecks size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-black text-2xl flex items-center gap-2"><ListChecks size={24} className="text-emerald-400" /> Matriz de Procesos</h2>
          <p className="text-gray-400 text-sm mt-1">{tasks.length} tareas totales · {filtered.length} filtradas</p>
        </div>
      </div>

      {/* Filters Box */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Buscar tarea o proceso..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all" 
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                showFilters || filterPhase || filterStatus || filterPriority || filterResponsible
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800'
              }`}
            >
              <Filter size={16} />
              <span>Filtros</span>
            </button>

            <button 
              onClick={openNew} 
              className="flex-1 md:flex-none bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus size={16} /> 
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filters */}
        {(showFilters || filterPhase || filterStatus || filterPriority || filterResponsible) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/5 animate-slide-down">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fase</label>
              <select 
                value={filterPhase} 
                onChange={(e) => setFilterPhase(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="">Todas las Fases</option>
                {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="">Todos los Estados</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prioridad</label>
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="">Todas</option>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Responsable</label>
              <select 
                value={filterResponsible} 
                onChange={(e) => setFilterResponsible(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              >
                <option value="">Todos</option>
                {RESPONSIBLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {(filterPhase || filterStatus || filterPriority || filterResponsible) && (
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button 
                  onClick={() => {
                    setFilterPhase('');
                    setFilterStatus('');
                    setFilterPriority('');
                    setFilterResponsible('');
                  }}
                  className="text-xs text-red-400 font-bold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop View Table */}
      <div className="hidden lg:block bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 w-12 text-center">#</th>
              <th className="px-5 py-4">Tarea / Proceso</th>
              <th className="px-5 py-4">Fase</th>
              <th className="px-5 py-4">Responsable</th>
              <th className="px-5 py-4 text-center">Prioridad</th>
              <th className="px-5 py-4 text-center">Estado</th>
              <th className="px-5 py-4 text-center">Avance</th>
              <th className="px-5 py-4 text-center">Semáforo</th>
              <th className="px-5 py-4 text-center">Fecha Obj.</th>
              <th className="px-5 py-4 text-center w-24">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((t) => {
              const s = semaforo(t);
              return (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs text-center">{t.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.expectedResult}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-300">
                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5 whitespace-nowrap">
                      {t.phase.split(' - ')[0]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-300">{t.responsible}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${prioColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <select 
                      value={t.status} 
                      onChange={(e) => updateTask(t.id, { status: e.target.value as TaskStatus })} 
                      className={`px-2.5 py-1 rounded-full text-xs font-bold bg-transparent border-0 cursor-pointer focus:ring-0 ${statusColor(t.status)}`}
                    >
                      {STATUSES.map((st) => <option key={st} value={st} className="bg-gray-900 text-white">{st}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <select 
                      value={t.progress} 
                      onChange={(e) => updateTask(t.id, { progress: Number(e.target.value) })} 
                      className="text-xs font-bold text-gray-200 border-0 bg-transparent cursor-pointer text-center focus:ring-0"
                    >
                      {PROGRESSES.map((p) => <option key={p} value={p} className="bg-gray-900 text-white">{p}%</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-xs text-gray-400 font-mono">
                    {new Date(t.targetDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => deleteTask(t.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards Layout (Aesthetic and touch-friendly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filtered.map((t) => {
          const s = semaforo(t);
          return (
            <div key={t.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-emerald-500/20 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono">#{t.id}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                      {t.phase.split(' - ')[0]}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base leading-tight">{t.title}</h4>
                  <p className="text-xs text-gray-400">{t.expectedResult}</p>
                </div>
                
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(t)} className="p-2.5 text-gray-400 hover:text-emerald-400 bg-gray-800 rounded-xl transition-all border border-gray-700/50"><Edit3 size={15} /></button>
                  <button onClick={() => deleteTask(t.id)} className="p-2.5 text-gray-400 hover:text-red-400 bg-gray-800 rounded-xl transition-all border border-gray-700/50"><Trash2 size={15} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Responsable</p>
                  <p className="font-semibold text-gray-200 mt-0.5">{t.responsible}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Prioridad</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold mt-1 ${prioColor(t.priority)}`}>
                    {t.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Estado</p>
                  <select 
                    value={t.status} 
                    onChange={(e) => updateTask(t.id, { status: e.target.value as TaskStatus })} 
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold bg-transparent cursor-pointer focus:ring-0 ${statusColor(t.status)}`}
                  >
                    {STATUSES.map((st) => <option key={st} value={st} className="bg-gray-900 text-white">{st}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Avance</p>
                  <select 
                    value={t.progress} 
                    onChange={(e) => updateTask(t.id, { progress: Number(e.target.value) })} 
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-200 bg-gray-800/80 border border-gray-700/50 cursor-pointer text-center focus:ring-0"
                  >
                    {PROGRESSES.map((p) => <option key={p} value={p} className="bg-gray-900 text-white">{p}%</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="font-semibold text-[11px]">{s.label} para entrega</span>
                </div>
                <div className="font-mono text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                  Vence: {new Date(t.targetDate).toLocaleDateString('es-AR')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white/[0.02] border border-white/10 rounded-2xl">
          <ListChecks size={44} className="mx-auto mb-3 opacity-20 text-emerald-400" />
          <p className="font-semibold text-gray-300">No hay tareas que coincidan con la búsqueda</p>
          <p className="text-xs text-gray-500 mt-1">Probá cambiando los filtros o agregá una nueva tarea.</p>
        </div>
      )}

      {/* Edit/Create Modal (Dark Glassmorphism style) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-black text-white text-lg">{editingTask ? 'Editar Tarea o Proceso' : 'Nueva Tarea de Control'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Título de Tarea</label>
                <input 
                  value={form.title || ''} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="Ej: Mapeo de flujos de trabajo"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Resultado Esperado</label>
                <input 
                  value={form.expectedResult || ''} 
                  onChange={(e) => setForm({ ...form, expectedResult: e.target.value })} 
                  placeholder="Ej: Diagrama de flujo aprobado y optimizado"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Fase del Plan</label>
                  <select 
                    value={form.phase} 
                    onChange={(e) => setForm({ ...form, phase: e.target.value as TaskPhase })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {PHASES.map((p) => <option key={p} className="bg-gray-900">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Tipo de Tarea</label>
                  <select 
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value as TaskType })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {TYPES.map((t) => <option key={t} className="bg-gray-900">{t}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Responsable</label>
                  <select 
                    value={form.responsible} 
                    onChange={(e) => setForm({ ...form, responsible: e.target.value as TaskResponsible })} 
                    className="w-full px-2.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {RESPONSIBLES.map((r) => <option key={r} className="bg-gray-900">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Prioridad</label>
                  <select 
                    value={form.priority} 
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} 
                    className="w-full px-2.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {PRIORITIES.map((p) => <option key={p} className="bg-gray-900">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Estado</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} 
                    className="w-full px-2.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {STATUSES.map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={form.startDate || ''} 
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Fecha Objetivo</label>
                  <input 
                    type="date" 
                    value={form.targetDate || ''} 
                    onChange={(e) => setForm({ ...form, targetDate: e.target.value })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Observaciones</label>
                <textarea 
                  value={form.observations || ''} 
                  onChange={(e) => setForm({ ...form, observations: e.target.value })} 
                  rows={2.5} 
                  placeholder="Notas internas..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
            </div>
            
            <div className="flex gap-2.5 justify-end pt-3 border-t border-white/5">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              
              <button 
                onClick={handleSave} 
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all"
              >
                <Save size={14} /> 
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
