'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Project, ProjectStatus } from '../../../lib/types';
import { FolderKanban, Plus, X, Save, Search, Edit3, Trash2, Calendar, DollarSign, Users, CheckCircle2 } from 'lucide-react';

const PROJECT_STATUSES: ProjectStatus[] = ['Onboarding', 'En desarrollo', 'En revisión', 'Entregado', 'En mantenimiento', 'Pausado', 'Cancelado'];
const STATUS_COLORS: Record<string, string> = {
  'Onboarding': 'bg-blue-100 text-blue-700', 'En desarrollo': 'bg-amber-100 text-amber-700',
  'En revisión': 'bg-violet-100 text-violet-700', 'Entregado': 'bg-emerald-100 text-emerald-700',
  'En mantenimiento': 'bg-indigo-100 text-indigo-700', 'Pausado': 'bg-orange-100 text-orange-700',
  'Cancelado': 'bg-red-100 text-red-700',
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, team } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>({});

  const filtered = projects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.client.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  const today = new Date().toISOString().split('T')[0];
  const openNew = () => {
    setEditingProject(null);
    setForm({ status: 'Onboarding', progress: 0, value: 0, startDate: today, estimatedEndDate: today, assignedTo: [], milestones: [], createdAt: new Date().toISOString() });
    setShowModal(true);
  };
  const openEdit = (p: Project) => { setEditingProject(p); setForm({ ...p }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name || !form.client) return;
    if (editingProject) { updateProject(editingProject.id, form); }
    else { addProject({ ...form, id: `proj-${Date.now()}`, milestones: form.milestones || [], assignedTo: form.assignedTo || [], createdAt: new Date().toISOString() } as Project); }
    setShowModal(false);
  };

  const activeProjects = projects.filter((p) => !['Entregado', 'Cancelado'].includes(p.status)).length;
  const totalValue = projects.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><FolderKanban size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><FolderKanban size={24} /> Gestión de Proyectos</h2>
          <p className="text-emerald-100 text-sm mt-1">{projects.length} proyectos · {activeProjects} activos · Valor total: ${totalValue.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar proyecto..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-gray-600">
          <option value="">Todos los estados</option>
          {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"><Plus size={16} /> Nuevo Proyecto</button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{p.name}</h3>
                  <p className="text-xs text-gray-400">{p.client}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[p.status]}`}>{p.status}</span>
              </div>
              {p.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Avance</span>
                  <span className="font-bold text-gray-600">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><DollarSign size={12} />${p.value.toLocaleString('es-AR')}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />{new Date(p.estimatedEndDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1 text-gray-400 hover:text-blue-600"><Edit3 size={14} /></button>
                  <button onClick={() => deleteProject(p.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 shadow-sm">
          <FolderKanban size={48} className="mx-auto mb-3 opacity-30" /><p className="font-medium">No hay proyectos</p><p className="text-sm">Creá el primer proyecto para empezar.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center"><h3 className="font-bold text-lg">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3><button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Nombre del Proyecto</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Cliente</label><input value={form.client || ''} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Descripción</label><textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Estado</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full px-3 py-2 border rounded-lg text-sm">{PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Valor ($)</label><input type="number" value={form.value || 0} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fecha Inicio</label><input type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fecha Est. Fin</label><input type="date" value={form.estimatedEndDate || ''} onChange={(e) => setForm({ ...form, estimatedEndDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Avance (%)</label><input type="range" min="0" max="100" step="5" value={form.progress || 0} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full" /><span className="text-sm font-bold text-gray-600">{form.progress || 0}%</span></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Notas</label><textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
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
