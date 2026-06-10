'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Project, ProjectStatus } from '../../../lib/types';
import { FolderKanban, Plus, X, Save, Search, Edit3, Trash2, Calendar, DollarSign, Users, CheckCircle2 } from 'lucide-react';

const PROJECT_STATUSES: ProjectStatus[] = ['Onboarding', 'En desarrollo', 'En revisión', 'Entregado', 'En mantenimiento', 'Pausado', 'Cancelado'];
const STATUS_COLORS: Record<string, string> = {
  'Onboarding': 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 
  'En desarrollo': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'En revisión': 'bg-violet-500/10 text-violet-400 border border-violet-500/20', 
  'Entregado': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'En mantenimiento': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', 
  'Pausado': 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  'Cancelado': 'bg-red-500/10 text-red-400 border border-red-500/20',
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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><FolderKanban size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-black text-2xl flex items-center gap-2"><FolderKanban size={24} className="text-emerald-400" /> Gestión de Proyectos</h2>
          <p className="text-gray-400 text-sm mt-1">
            {projects.length} proyectos · {activeProjects} activos · Valor total: <span className="font-mono font-bold text-emerald-400">${totalValue.toLocaleString('es-AR')}</span>
          </p>
        </div>
      </div>

      {/* Controls Box */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Buscar proyecto o cliente..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all" 
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-emerald-500/40"
          >
            <option value="">Todos los estados</option>
            {PROJECT_STATUSES.map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
          </select>
          <button 
            onClick={openNew} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus size={16} /> 
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/20 shadow-sm transition-all overflow-hidden flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{p.client}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[p.status]}`}>{p.status}</span>
              </div>
              {p.description && <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{p.description}</p>}
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Progreso</span>
                  <span className="font-bold text-gray-300">{p.progress}%</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 border border-emerald-500/10 rounded-lg">
                  <DollarSign size={12} />
                  {p.value.toLocaleString('es-AR')}
                </span>
                <span className="flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-1 rounded-lg">
                  <Calendar size={12} className="text-gray-500" />
                  {new Date(p.estimatedEndDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all"><Edit3 size={14} /></button>
                <button onClick={() => deleteProject(p.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-500 bg-white/[0.01] border border-white/5 rounded-2xl">
          <FolderKanban size={48} className="mx-auto mb-3 opacity-20 text-emerald-400" />
          <p className="font-medium text-gray-400">No hay proyectos registrados</p>
          <p className="text-sm text-gray-600 mt-1">Crea el primer proyecto para iniciar el seguimiento.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-black text-white text-lg">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Nombre del Proyecto</label>
                <input 
                  value={form.name || ''} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Nombre..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Cliente</label>
                <input 
                  value={form.client || ''} 
                  onChange={(e) => setForm({ ...form, client: e.target.value })} 
                  placeholder="Nombre del cliente..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Descripción</label>
                <textarea 
                  value={form.description || ''} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  rows={2.5} 
                  placeholder="Alcance, objetivos del proyecto..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 focus:outline-none transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Estado</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {PROJECT_STATUSES.map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Valor ($)</label>
                  <input 
                    type="number" 
                    value={form.value || 0} 
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} 
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white font-mono focus:outline-none" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Fecha Inicio</label>
                  <input 
                    type="date" 
                    value={form.startDate || ''} 
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Fecha Est. Fin</label>
                  <input 
                    type="date" 
                    value={form.estimatedEndDate || ''} 
                    onChange={(e) => setForm({ ...form, estimatedEndDate: e.target.value })} 
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Avance ({form.progress || 0}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  value={form.progress || 0} 
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} 
                  className="w-full accent-emerald-500 bg-gray-950 rounded-xl h-2 cursor-pointer border border-white/5" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Notas del Proyecto</label>
                <textarea 
                  value={form.notes || ''} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  rows={2} 
                  placeholder="Consideraciones adicionales..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none" 
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
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all"
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

