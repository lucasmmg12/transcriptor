'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { TeamMember, TeamRole } from '../../../lib/types';
import { UserCog, Plus, X, Save, Edit3, Trash2, Mail, Phone, Briefcase, Award } from 'lucide-react';

const ROLES: TeamRole[] = ['Director', 'Desarrollador', 'Diseñador', 'Comercial', 'Consultor', 'Freelancer'];
const ROLE_COLORS: Record<string, string> = {
  'Director': 'from-violet-500 to-violet-600', 'Desarrollador': 'from-blue-500 to-blue-600',
  'Diseñador': 'from-pink-500 to-pink-600', 'Comercial': 'from-emerald-500 to-emerald-600',
  'Consultor': 'from-amber-500 to-amber-600', 'Freelancer': 'from-gray-500 to-gray-600',
};

export default function TeamPage() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, tasks, projects } = useAdminStore();
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
    if (editingMember) { updateTeamMember(editingMember.id, form); }
    else { addTeamMember({ ...form, id: `tm-${Date.now()}`, skills: form.skills || [], currentProjects: form.currentProjects || [] } as TeamMember); }
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><UserCog size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><UserCog size={24} /> Gestión de Equipo</h2>
          <p className="text-indigo-200 text-sm mt-1">{team.length} miembros · {team.filter((m) => m.active).length} activos</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"><Plus size={16} /> Agregar Miembro</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((m) => {
          const memberTasks = tasks.filter((t) => t.responsible.includes(m.name)).length;
          return (
            <div key={m.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden ${!m.active ? 'opacity-60' : ''}`}>
              <div className={`h-1.5 bg-gradient-to-r ${ROLE_COLORS[m.role] || 'from-gray-400 to-gray-500'}`} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ROLE_COLORS[m.role] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">{m.name}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(m)} className="p-1 text-gray-400 hover:text-blue-600"><Edit3 size={14} /></button>
                        <button onClick={() => deleteTeamMember(m.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Briefcase size={12} /> {m.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={12} className="text-gray-400" /> {m.email}</p>
                  {m.phone && <p className="text-xs text-gray-500 flex items-center gap-2"><Phone size={12} className="text-gray-400" /> {m.phone}</p>}
                </div>
                {m.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {m.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">{s}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>{memberTasks} tareas asignadas</span>
                  <span className={`flex items-center gap-1 ${m.active ? 'text-emerald-500' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${m.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    {m.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center"><h3 className="font-bold text-lg">{editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}</h3><button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Nombre</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Rol</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as TeamRole })} className="w-full px-3 py-2 border rounded-lg text-sm">{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Email</label><input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Teléfono</label><input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Skills</label>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Agregar skill..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                  <button type="button" onClick={addSkill} className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">+</button>
                </div>
                {form.skills && form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold flex items-center gap-1">{s} <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-red-500"><X size={10} /></button></span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} id="active" className="rounded" />
                <label htmlFor="active" className="text-sm text-gray-600">Activo</label>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md"><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
