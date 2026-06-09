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
    if (t.status === 'Bloqueado') return { color: 'bg-gray-500', label: 'Bloq' };
    if (t.status === 'Cancelado') return { color: 'bg-gray-300', label: '—' };
    const diff = Math.ceil((new Date(t.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { color: 'bg-red-500', label: `${Math.abs(diff)}d atrás` };
    if (diff <= 3) return { color: 'bg-amber-500', label: `${diff}d` };
    return { color: 'bg-emerald-500', label: `${diff}d` };
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { 'Completado': 'bg-emerald-100 text-emerald-700', 'En curso': 'bg-blue-100 text-blue-700', 'En análisis': 'bg-amber-100 text-amber-700', 'En revisión': 'bg-violet-100 text-violet-700', 'Bloqueado': 'bg-red-100 text-red-700', 'Postergado': 'bg-orange-100 text-orange-700', 'Cancelado': 'bg-gray-100 text-gray-500', 'Pendiente': 'bg-gray-100 text-gray-600' };
    return m[s] || 'bg-gray-100 text-gray-600';
  };

  const prioColor = (p: string) => p === 'Alta' ? 'text-red-600 bg-red-50' : p === 'Media' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><ListChecks size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><ListChecks size={24} /> Matriz de Control</h2>
          <p className="text-gray-300 text-sm mt-1">{tasks.length} tareas · {filtered.length} mostradas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar tarea..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-600">
            <option value="">Todas las Fases</option>
            {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-600">
            <option value="">Todos los Estados</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-600">
            <option value="">Prioridad</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterResponsible} onChange={(e) => setFilterResponsible(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-600">
            <option value="">Responsable</option>
            {RESPONSIBLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
            <Plus size={16} /> Nueva Tarea
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[900px]">
          <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 w-10">#</th>
              <th className="px-4 py-3">Tarea</th>
              <th className="px-4 py-3">Fase</th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3 text-center">Prioridad</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Avance</th>
              <th className="px-4 py-3 text-center">Semáforo</th>
              <th className="px-4 py-3 text-center">Fecha Obj.</th>
              <th className="px-4 py-3 text-center w-20">Acc.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => {
              const s = semaforo(t);
              return (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.expectedResult}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{t.phase.replace('Fase ', 'F')}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{t.responsible}</td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${prioColor(t.priority)}`}>{t.priority}</span></td>
                  <td className="px-4 py-3 text-center">
                    <select value={t.status} onChange={(e) => updateTask(t.id, { status: e.target.value as TaskStatus })} className={`px-2 py-0.5 rounded-full text-xs font-bold border-0 cursor-pointer ${statusColor(t.status)}`}>
                      {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select value={t.progress} onChange={(e) => updateTask(t.id, { progress: Number(e.target.value) })} className="text-xs font-bold text-gray-600 border-0 bg-transparent cursor-pointer text-center">
                      {PROGRESSES.map((p) => <option key={p} value={p}>{p}%</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-xs text-gray-500">{s.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500 font-mono">{new Date(t.targetDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(t)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => deleteTask(t.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-gray-400"><ListChecks size={40} className="mx-auto mb-2 opacity-30" /><p>No hay tareas que coincidan</p></div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Título</label><input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Resultado Esperado</label><input value={form.expectedResult || ''} onChange={(e) => setForm({ ...form, expectedResult: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fase</label><select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value as TaskPhase })} className="w-full px-3 py-2 border rounded-lg text-sm">{PHASES.map((p) => <option key={p}>{p}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Tipo</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TaskType })} className="w-full px-3 py-2 border rounded-lg text-sm">{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Responsable</label><select value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value as TaskResponsible })} className="w-full px-3 py-2 border rounded-lg text-sm">{RESPONSIBLES.map((r) => <option key={r}>{r}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Prioridad</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} className="w-full px-3 py-2 border rounded-lg text-sm">{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Estado</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} className="w-full px-3 py-2 border rounded-lg text-sm">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fecha Inicio</label><input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fecha Objetivo</label><input type="date" value={form.targetDate || ''} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Observaciones</label><textarea value={form.observations || ''} onChange={(e) => setForm({ ...form, observations: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" /></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-md"><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
