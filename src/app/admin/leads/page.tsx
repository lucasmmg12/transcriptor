'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Lead, LeadStage, LeadSource } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';
import { Users, Plus, X, Save, Search, Phone, Mail, Building2, DollarSign, ArrowRight, Edit3, Trash2, Sparkles } from 'lucide-react';

const STAGES: LeadStage[] = ['Nuevo', 'Contactado', 'Diagnóstico', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido'];
const SOURCES: LeadSource[] = ['Referido', 'Web', 'Redes Sociales', 'Evento', 'WhatsApp', 'Diagnóstico Grow IQ', 'Otro'];
const STAGE_COLORS: Record<string, string> = {
  'Nuevo': 'bg-gray-800 text-gray-300 border-gray-700/50',
  'Contactado': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Diagnóstico': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Propuesta': 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  'Negociación': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  'Cerrado Ganado': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Cerrado Perdido': 'bg-red-500/10 text-red-400 border border-red-500/20',
};
const STAGE_HEADER: Record<string, string> = {
  'Nuevo': 'border-t-gray-700', 'Contactado': 'border-t-blue-500', 'Diagnóstico': 'border-t-amber-500',
  'Propuesta': 'border-t-violet-500', 'Negociación': 'border-t-indigo-500', 'Cerrado Ganado': 'border-t-emerald-500', 'Cerrado Perdido': 'border-t-red-500',
};

export default function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead } = useAdminStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Lead>>({});
  const [selectedMobileStage, setSelectedMobileStage] = useState<LeadStage>('Nuevo');
  
  const [diagnosticsList, setDiagnosticsList] = useState<any[]>([]);
  const [selectedDiagId, setSelectedDiagId] = useState<string>('');

  useEffect(() => {
    async function fetchDiagnostics() {
      const { data, error } = await supabase
        .from('grow_iq_diagnostics')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setDiagnosticsList(data);
      }
    }
    fetchDiagnostics();
  }, []);

  const filtered = leads.filter((l) => {
    if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.contactName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditingLead(null);
    setSelectedDiagId('');
    setForm({ stage: 'Nuevo', source: 'Referido', estimatedValue: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setShowModal(true);
  };

  const openEdit = (l: Lead) => { 
    setEditingLead(l); 
    setSelectedDiagId('');
    setForm({ ...l }); 
    setShowModal(true); 
  };

  const handleSelectDiagnostic = (diagId: string) => {
    setSelectedDiagId(diagId);
    if (!diagId) return;
    const d = diagnosticsList.find(item => item.id === diagId);
    if (d) {
      const name = d.full_name || d.contact_name || '';
      const email = d.email || d.contact_email || '';
      const phone = d.whatsapp || '';
      const company = d.company_name || '';
      const role = d.role || d.contact_role || '';
      const score = d.total_score ?? d.score ?? 0;

      setForm(prev => ({
        ...prev,
        company,
        contactName: name,
        contactEmail: email,
        contactPhone: phone,
        source: 'Diagnóstico Grow IQ',
        stage: 'Diagnóstico',
        interestedService: `Software a medida (${company})`,
        notes: `Importado desde Diagnóstico Grow IQ. Score: ${score}/100. Nivel: ${d.maturity_level}. Rol: ${role}`,
      }));
    }
  };

  const handleSave = () => {
    if (!form.company || !form.contactName) return;
    if (editingLead) {
      updateLead(editingLead.id, { ...form, updatedAt: new Date().toISOString() });
    } else {
      addLead({ ...form, id: `lead-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Lead);
    }
    setShowModal(false);
  };

  const moveStage = (id: string, newStage: LeadStage) => {
    updateLead(id, { stage: newStage, updatedAt: new Date().toISOString() });
  };

  const activeStages = STAGES.filter((s) => s !== 'Cerrado Perdido');
  const totalPipeline = leads.filter((l) => !['Cerrado Ganado', 'Cerrado Perdido'].includes(l.stage)).reduce((s, l) => s + l.estimatedValue, 0);
  const wonValue = leads.filter((l) => l.stage === 'Cerrado Ganado').reduce((s, l) => s + l.estimatedValue, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-violet-950 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><Users size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-black text-2xl flex items-center gap-2"><Users size={24} className="text-violet-400" /> Leads & CRM</h2>
          <p className="text-gray-400 text-sm mt-1">
            Pipeline Activo: <span className="font-mono font-bold text-emerald-400">${totalPipeline.toLocaleString('es-AR')}</span> · Ganados: <span className="font-mono font-bold text-violet-400">${wonValue.toLocaleString('es-AR')}</span>
          </p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Buscar empresa o contacto..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all" 
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
            <button onClick={() => setView('kanban')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>Kanban</button>
            <button onClick={() => setView('table')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'table' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>Tabla</button>
          </div>
          <button 
            onClick={openNew} 
            className="bg-violet-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
          >
            <Plus size={16} /> 
            <span>Nuevo Lead</span>
          </button>
        </div>
      </div>

      <div className="block md:hidden">
        <select 
          value={selectedMobileStage}
          onChange={(e) => setSelectedMobileStage(e.target.value as LeadStage)}
          className="w-full p-3 bg-gray-900 border border-gray-800 text-white font-bold rounded-xl text-sm"
        >
          {STAGES.map((s) => <option key={s} value={s}>{s} ({leads.filter((l) => l.stage === s).length})</option>)}
        </select>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {activeStages.map((stg) => {
            const stageLeads = filtered.filter((l) => l.stage === stg);
            return (
              <div key={stg} className={`bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col min-h-[500px] border-t-2 ${STAGE_HEADER[stg] || ''}`}>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <span className="font-bold text-xs text-gray-300 uppercase tracking-wider">{stg}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{stageLeads.length}</span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageLeads.map((l) => (
                    <div key={l.id} className="bg-gray-900 border border-gray-800/80 rounded-xl p-3.5 space-y-2 hover:border-violet-500/40 transition-all group relative shadow-md">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm block leading-tight">{l.company}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button onClick={() => openEdit(l)} className="text-gray-400 hover:text-white p-1"><Edit3 size={12} /></button>
                          <button onClick={() => deleteLead(l.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={12} /></button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex items-center gap-1.5"><Building2 size={11} className="text-gray-500" /> {l.contactName}</div>
                        {l.interestedService && <div className="text-[11px] text-gray-500 italic truncate">{l.interestedService}</div>}
                      </div>

                      {l.estimatedValue > 0 && (
                        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-emerald-400">${l.estimatedValue.toLocaleString('es-AR')}</span>
                        </div>
                      )}

                      <div className="pt-2 flex justify-between items-center text-[10px] border-t border-white/5">
                        <span className={`px-2 py-0.5 rounded ${STAGE_COLORS[l.stage] || ''}`}>{l.source}</span>
                        <select 
                          value={l.stage} 
                          onChange={(e) => moveStage(l.id, e.target.value as LeadStage)}
                          className="bg-gray-950 border border-gray-800 text-gray-400 text-[10px] rounded px-1 py-0.5 focus:outline-none"
                        >
                          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="p-4">Empresa / Contacto</th>
                <th className="p-4">Etapa</th>
                <th className="p-4">Origen</th>
                <th className="p-4">Servicio</th>
                <th className="p-4 text-right">Valor Estimado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.01]">
                  <td className="p-4">
                    <div className="font-bold text-white">{l.company}</div>
                    <div className="text-xs text-gray-400">{l.contactName} · {l.contactEmail}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STAGE_COLORS[l.stage]}`}>{l.stage}</span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">{l.source}</td>
                  <td className="p-4 text-xs text-gray-300">{l.interestedService || '-'}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">${l.estimatedValue.toLocaleString('es-AR')}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(l)} className="text-gray-400 hover:text-white"><Edit3 size={14} /></button>
                      <button onClick={() => deleteLead(l.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-black text-white text-lg">{editingLead ? 'Editar Lead' : 'Nuevo Lead'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 pt-1">
              {!editingLead && diagnosticsList.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                  <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles size={14} /> Importar desde Diagnóstico Grow IQ
                  </label>
                  <select 
                    value={selectedDiagId} 
                    onChange={(e) => handleSelectDiagnostic(e.target.value)} 
                    className="w-full px-3 py-2 bg-gray-950 border border-emerald-500/30 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="" className="bg-gray-900 text-gray-400">-- Ingreso Manual o Seleccionar Diagnóstico --</option>
                    {diagnosticsList.map((diag) => {
                      const company = diag.company_name;
                      const name = diag.full_name || diag.contact_name || 'Sin Nombre';
                      const score = diag.total_score ?? diag.score ?? 0;
                      return (
                        <option key={diag.id} value={diag.id} className="bg-gray-900">
                          {company} — {name} ({score}/100 - {diag.maturity_level})
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-gray-400">Seleccioná un cliente que realizó el test Grow IQ para autocompletar la empresa, contacto, teléfono y notas.</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Empresa *</label>
                <input 
                  value={form.company || ''} 
                  onChange={(e) => setForm({ ...form, company: e.target.value })} 
                  placeholder="Nombre de la empresa..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 focus:outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Nombre Contacto *</label>
                  <input 
                    value={form.contactName || ''} 
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })} 
                    placeholder="Nombre del referente..."
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 focus:outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Email</label>
                  <input 
                    type="email" 
                    value={form.contactEmail || ''} 
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} 
                    placeholder="correo@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 focus:outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Teléfono</label>
                  <input 
                    value={form.contactPhone || ''} 
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} 
                    placeholder="+54 9..."
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Origen</label>
                  <select 
                    value={form.source} 
                    onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {SOURCES.map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Etapa CRM</label>
                  <select 
                    value={form.stage} 
                    onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })} 
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white focus:outline-none"
                  >
                    {STAGES.map((s) => <option key={s} className="bg-gray-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Valor Estimado ($)</label>
                  <input 
                    type="number" 
                    value={form.estimatedValue || 0} 
                    onChange={(e) => setForm({ ...form, estimatedValue: Number(e.target.value) })} 
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white font-mono focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Servicio Interesado</label>
                <input 
                  value={form.interestedService || ''} 
                  onChange={(e) => setForm({ ...form, interestedService: e.target.value })} 
                  placeholder="Ej: Reingeniería del Proceso Logístico"
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Notas Internas</label>
                <textarea 
                  value={form.notes || ''} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  rows={2.5} 
                  placeholder="Bitácora de seguimiento..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 focus:outline-none transition-all" 
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
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-500/10 transition-all"
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
