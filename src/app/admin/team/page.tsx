'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { TeamMember, TeamRole } from '../../../lib/types';
import { UserCog, Plus, X, Save, Edit3, Trash2, Mail, Phone, Briefcase, Award } from 'lucide-react';

const ROLES: TeamRole[] = ['Director', 'Desarrollador', 'Diseñador', 'Comercial', 'Consultor', 'Freelancer'];
const ROLE_COLORS: Record<string, string> = {
  'Director': 'from-violet-500 to-indigo-500',
  'Desarrollador': 'from-blue-500 to-cyan-500',
  'Diseñador': 'from-pink-500 to-rose-500',
  'Comercial': 'from-emerald-500 to-teal-500',
  'Consultor': 'from-amber-500 to-orange-500',
  'Freelancer': 'from-gray-500 to-slate-500',
};

const ROLE_GLOWS: Record<string, string> = {
  'Director': 'shadow-violet-500/10 border-violet-500/20',
  'Desarrollador': 'shadow-blue-500/10 border-blue-500/20',
  'Diseñador': 'shadow-pink-500/10 border-pink-500/20',
  'Comercial': 'shadow-emerald-500/10 border-emerald-500/20',
  'Consultor': 'shadow-amber-500/10 border-amber-500/20',
  'Freelancer': 'shadow-gray-500/10 border-gray-500/20',
};

export default function TeamPage() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, tasks } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>({});
  const [skillInput, setSkillInput] = useState('');

  const openNew = () => {
    setEditingMember(null);
    setForm({ role: 'Desarrollador', active: true, skills: [], currentProjects: [], joinDate: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };
  const openEdit = (m: TeamMember) => { setEditingMember(m); setForm({ ...m }); setShowModal(true); };
  
  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editingMember) {
      updateTeamMember(editingMember.id, form);
    } else {
      addTeamMember({
        ...form,
        id: `tm-${Date.now()}`,
        skills: form.skills || [],
        currentProjects: form.currentProjects || []
      } as TeamMember);
    }
    setShowModal(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills?.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...(form.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };
  const removeSkill = (s: string) => setForm({ ...form, skills: form.skills?.filter((sk) => sk !== s) });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner - Cinematográfico */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-gray-950/30 p-6 text-white shadow-2xl backdrop-blur-md">
        <div className="absolute -right-6 -top-6 text-indigo-500/10 pointer-events-none">
          <UserCog size={160} className="rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <UserCog size={28} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              Gestión de Equipo
            </h2>
            <p className="text-indigo-200/60 text-sm mt-1">
              Organizamos procesos, personas y responsabilidades.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 self-start md:self-auto backdrop-blur-sm">
            <div className="text-right">
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Miembros</p>
              <p className="text-lg font-mono font-black text-white">{team.length} <span className="text-xs font-normal text-indigo-200/50">({team.filter((m) => m.active).length} activos)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Acción Principal */}
      <div className="flex justify-end px-1 sm:px-0">
        <button 
          onClick={openNew} 
          className="w-full sm:w-auto bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] border border-indigo-500/30"
        >
          <Plus size={18} /> Agregar Miembro
        </button>
      </div>

      {/* Grid de Miembros - Mobile First */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((m) => {
          const memberTasks = tasks.filter((t) => t.responsible.includes(m.name)).length;
          const roleColor = ROLE_COLORS[m.role] || 'from-gray-500 to-slate-500';
          const glowClass = ROLE_GLOWS[m.role] || 'shadow-gray-500/10 border-gray-500/20';
          
          return (
            <div 
              key={m.id} 
              className={`group relative bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md flex flex-col justify-between ${!m.active ? 'opacity-50' : ''}`}
            >
              {/* Barra superior de color de rol */}
              <div className={`h-1.5 bg-gradient-to-r ${roleColor} w-full`} />
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4">
                    {/* Avatar con Inicial */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      {m.name[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-white text-base truncate group-hover:text-indigo-200 transition-colors">{m.name}</h3>
                        <div className="flex gap-0.5 shrink-0">
                          <button 
                            onClick={() => openEdit(m)} 
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors"
                            aria-label="Editar"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => deleteTeamMember(m.id)} 
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300 font-medium mt-0.5">
                        <Briefcase size={12} /> {m.role}
                      </span>
                    </div>
                  </div>

                  {/* Datos de contacto */}
                  <div className="mt-4 space-y-2 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-2 truncate">
                      <Mail size={13} className="text-indigo-400/60 shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </p>
                    {m.phone && (
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <Phone size={13} className="text-indigo-400/60 shrink-0" />
                        <span>{m.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Skills / Habilidades */}
                  {m.skills.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400/60 uppercase tracking-wider mb-1.5">
                        <Award size={10} /> Habilidades
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {m.skills.map((s) => (
                          <span 
                            key={s} 
                            className="px-2 py-0.5 bg-white/5 border border-white/10 text-indigo-200/80 rounded-lg text-[10px] font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer del card */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono">{memberTasks} tareas asignadas</span>
                  <span className={`flex items-center gap-1.5 font-bold ${m.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                    <span className={`relative flex h-2 w-2`}>
                      {m.active && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${m.active ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
                    </span>
                    {m.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Edición / Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-950 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-lg text-white">
                {editingMember ? 'Editar Miembro' : 'Nuevo Miembro de Equipo'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Nombre Completo</label>
                  <input 
                    type="text"
                    value={form.name || ''} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    placeholder="Ej. Lucas Gómez"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Rol / Especialidad</label>
                  <select 
                    value={form.role} 
                    onChange={(e) => setForm({ ...form, role: e.target.value as TeamRole })} 
                    className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Email</label>
                  <input 
                    type="email" 
                    value={form.email || ''} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    placeholder="correo@empresa.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Teléfono</label>
                  <input 
                    type="text"
                    value={form.phone || ''} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    placeholder="+54 9..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">Habilidades / Tags</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} 
                    placeholder="Ej. React, Python, QA..." 
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={addSkill} 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  >
                    +
                  </button>
                </div>
                {form.skills && form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                    {form.skills.map((s) => (
                      <span 
                        key={s} 
                        className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        {s} 
                        <button 
                          type="button"
                          onClick={() => removeSkill(s)} 
                          className="text-indigo-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  checked={form.active ?? true} 
                  onChange={(e) => setForm({ ...form, active: e.target.checked })} 
                  id="active" 
                  className="rounded bg-gray-900 border-white/10 text-indigo-600 focus:ring-indigo-500/30 h-4 w-4" 
                />
                <label htmlFor="active" className="text-sm text-gray-300 select-none">Este miembro está activo en la plataforma</label>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
              <button 
                type="button"
                onClick={() => setShowModal(false)} 
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSave} 
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-500/30 transition-all"
              >
                <Save size={14} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
