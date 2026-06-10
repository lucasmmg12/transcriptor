'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Lead, LeadStage, LeadSource } from '../../../lib/types';
import { Users, Plus, X, Save, Search, Phone, Mail, Building2, DollarSign, ArrowRight, Edit3, Trash2 } from 'lucide-react';

const STAGES: LeadStage[] = ['Nuevo', 'Contactado', 'Diagnóstico', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido'];
const SOURCES: LeadSource[] = ['Referido', 'Web', 'Redes Sociales', 'Evento', 'WhatsApp', 'Otro'];
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

  const filtered = leads.filter((l) => {
    if (search && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.contactName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditingLead(null);
    setForm({ stage: 'Nuevo', source: 'Referido', estimatedValue: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setShowModal(true);
  };

  const openEdit = (l: Lead) => { setEditingLead(l); setForm({ ...l }); setShowModal(true); };

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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><Users size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-black text-2xl flex items-center gap-2"><Users size={24} className="text-violet-400" /> Leads & CRM</h2>
          <p className="text-gray-400 text-sm mt-1">
            Pipeline Activo: <span className="font-mono font-bold text-emerald-400">${totalPipeline.toLocaleString('es-AR')}</span> · Ganados: <span className="font-mono font-bold text-violet-400">${wonValue.toLocaleString('es-AR')}</span>
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

      {/* Kanban View */}
      {view === 'kanban' && (
        <>
          {/* Mobile Tabbed Stage Selector */}
          <div className="lg:hidden">
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {activeStages.map((stage) => {
                const count = filtered.filter((l) => l.stage === stage).length;
                const active = selectedMobileStage === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedMobileStage(stage)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/10'
                        : 'bg-white/[0.03] text-gray-400 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <span>{stage}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Lead Cards for selected stage */}
            <div className="space-y-3 mt-3">
              {filtered.filter((l) => l.stage === selectedMobileStage).map((lead) => (
                <div 
                  key={lead.id} 
                  onClick={() => openEdit(lead)} 
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-sm hover:border-violet-500/20 transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{lead.company}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{lead.contactName}</p>
                    </div>
                    {lead.estimatedValue > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        ${lead.estimatedValue.toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                  
                  {lead.interestedService && (
                    <div className="text-xs text-gray-300 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
                      {lead.interestedService}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-500">Origen: {lead.source}</span>
                    <div className="flex gap-1.5">
                      {STAGES.indexOf(selectedMobileStage) > 0 && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const prev = STAGES[STAGES.indexOf(selectedMobileStage) - 1];
                            moveStage(lead.id, prev);
                            setSelectedMobileStage(prev);
                          }} 
                          className="text-[10px] bg-gray-800 border border-gray-700 text-gray-300 px-2 py-1 rounded-lg font-bold"
                        >
                          ← Mover
                        </button>
                      )}
                      {STAGES.indexOf(selectedMobileStage) < STAGES.length - 2 && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const next = STAGES[STAGES.indexOf(selectedMobileStage) + 1];
                            moveStage(lead.id, next);
                            setSelectedMobileStage(next);
                          }} 
                          className="text-[10px] bg-violet-600/20 border border-violet-500/30 text-violet-400 px-2 py-1 rounded-lg font-bold"
                        >
                          Avanzar →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filtered.filter((l) => l.stage === selectedMobileStage).length === 0 && (
                <div className="py-12 text-center text-gray-500 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <p className="font-semibold text-gray-400">Sin leads en esta etapa</p>
                  <p className="text-xs text-gray-600 mt-1">Arrastrá un lead o avánzalo para verlo acá.</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Kanban Board */}
          <div className="hidden lg:flex gap-4 overflow-x-auto pb-4">
            {activeStages.map((stage) => {
              const stageLeads = filtered.filter((l) => l.stage === stage);
              const stageIdx = STAGES.indexOf(stage);
              return (
                <div key={stage} className={`min-w-[280px] flex-1 bg-white/[0.02] rounded-2xl border border-white/5 border-t-4 ${STAGE_HEADER[stage]}`}>
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{stage}</h3>
                      <span className="text-xs font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 min-h-[200px]">
                    {stageLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-sm hover:border-violet-500/30 transition-all cursor-pointer space-y-2 group" 
                        onClick={() => openEdit(lead)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-sm text-white group-hover:text-violet-400 transition-colors">{lead.company}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{lead.contactName}</p>
                          </div>
                        </div>
                        
                        {lead.interestedService && (
                          <p className="text-xs text-gray-500 truncate mt-1 bg-white/[0.02] p-1.5 rounded border border-white/5">{lead.interestedService}</p>
                        )}

                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/5">
                          {lead.estimatedValue > 0 ? (
                            <span className="text-xs font-mono font-bold text-emerald-400">${lead.estimatedValue.toLocaleString('es-AR')}</span>
                          ) : (
                            <span className="text-[10px] text-gray-500">Sin valor</span>
                          )}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {stageIdx > 0 && (
                              <button onClick={(e) => { e.stopPropagation(); moveStage(lead.id, STAGES[stageIdx - 1]); }} className="text-[10px] text-gray-400 hover:text-white px-1">←</button>
                            )}
                            {stageIdx < STAGES.length - 2 && (
                              <button onClick={(e) => { e.stopPropagation(); moveStage(lead.id, STAGES[stageIdx + 1]); }} className="text-[10px] text-violet-400 hover:text-violet-300 px-1 font-bold">→</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Empresa</th>
                <th className="px-5 py-4">Contacto</th>
                <th className="px-5 py-4">Etapa</th>
                <th className="px-5 py-4">Origen</th>
                <th className="px-5 py-4 text-right">Valor Est.</th>
                <th className="px-5 py-4 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 font-bold text-white">{l.company}</td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 font-semibold">{l.contactName}</p>
                    <p className="text-xs text-gray-500">{l.contactEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select 
                      value={l.stage} 
                      onChange={(e) => updateLead(l.id, { stage: e.target.value as LeadStage })} 
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 cursor-pointer focus:ring-0 ${STAGE_COLORS[l.stage]}`}
                    >
                      {STAGES.map((s) => <option key={s} className="bg-gray-900 text-white">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{l.source}</td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">${l.estimatedValue.toLocaleString('es-AR')}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(l)} className="p-1.5 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => deleteLead(l.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users size={44} className="mx-auto mb-3 opacity-20 text-violet-400" />
              <p className="font-semibold text-gray-300">Sin leads registrados</p>
              <p className="text-xs text-gray-500 mt-1">Hacé clic en "Nuevo Lead" para empezar.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Modal (Dark Glassmorphism style) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-black text-white text-lg">{editingLead ? 'Editar Lead' : 'Nuevo Lead'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Empresa</label>
                <input 
                  value={form.company || ''} 
                  onChange={(e) => setForm({ ...form, company: e.target.value })} 
                  placeholder="Nombre de la empresa..."
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 focus:outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">Nombre Contacto</label>
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

