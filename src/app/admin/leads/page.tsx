'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Lead, LeadStage, LeadSource } from '../../../lib/types';
import { Users, Plus, X, Save, Search, Phone, Mail, Building2, DollarSign, ArrowRight, Edit3, Trash2, GripVertical } from 'lucide-react';

const STAGES: LeadStage[] = ['Nuevo', 'Contactado', 'Diagnóstico', 'Propuesta', 'Negociación', 'Cerrado Ganado', 'Cerrado Perdido'];
const SOURCES: LeadSource[] = ['Referido', 'Web', 'Redes Sociales', 'Evento', 'WhatsApp', 'Otro'];
const STAGE_COLORS: Record<string, string> = {
  'Nuevo': 'bg-gray-100 text-gray-700 border-gray-200',
  'Contactado': 'bg-blue-50 text-blue-700 border-blue-200',
  'Diagnóstico': 'bg-amber-50 text-amber-700 border-amber-200',
  'Propuesta': 'bg-violet-50 text-violet-700 border-violet-200',
  'Negociación': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Cerrado Ganado': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cerrado Perdido': 'bg-red-50 text-red-700 border-red-200',
};
const STAGE_HEADER: Record<string, string> = {
  'Nuevo': 'border-t-gray-400', 'Contactado': 'border-t-blue-500', 'Diagnóstico': 'border-t-amber-500',
  'Propuesta': 'border-t-violet-500', 'Negociación': 'border-t-indigo-500', 'Cerrado Ganado': 'border-t-emerald-500', 'Cerrado Perdido': 'border-t-red-500',
};

export default function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead } = useAdminStore();
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Lead>>({});

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-800 to-violet-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Users size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><Users size={24} /> Leads & CRM</h2>
          <p className="text-violet-200 text-sm mt-1">{leads.length} leads · Pipeline: ${totalPipeline.toLocaleString('es-AR')} · Ganados: ${wonValue.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa o contacto..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'kanban' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>Kanban</button>
          <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'table' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>Tabla</button>
        </div>
        <button onClick={openNew} className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-violet-700 transition-all shadow-md">
          <Plus size={16} /> Nuevo Lead
        </button>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeStages.map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            const stageIdx = STAGES.indexOf(stage);
            return (
              <div key={stage} className={`min-w-[280px] flex-shrink-0 bg-gray-50 rounded-xl border border-gray-200 border-t-4 ${STAGE_HEADER[stage]}`}>
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700">{stage}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 min-h-[100px]">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => openEdit(lead)}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{lead.company}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{lead.contactName}</p>
                        </div>
                        {lead.estimatedValue > 0 && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">${lead.estimatedValue.toLocaleString('es-AR')}</span>
                        )}
                      </div>
                      {lead.interestedService && <p className="text-xs text-gray-400 mt-2 truncate">{lead.interestedService}</p>}
                      {/* Quick move buttons */}
                      <div className="flex gap-1 mt-2">
                        {stageIdx > 0 && (
                          <button onClick={(e) => { e.stopPropagation(); moveStage(lead.id, STAGES[stageIdx - 1]); }} className="text-[10px] text-gray-400 hover:text-gray-600 px-1">← Atrás</button>
                        )}
                        {stageIdx < STAGES.length - 2 && (
                          <button onClick={(e) => { e.stopPropagation(); moveStage(lead.id, STAGES[stageIdx + 1]); }} className="text-[10px] text-emerald-500 hover:text-emerald-700 px-1 ml-auto">Avanzar →</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Etapa</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3 text-right">Valor Est.</th>
                <th className="px-4 py-3 text-center">Acc.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{l.company}</td>
                  <td className="px-4 py-3"><p className="text-gray-700">{l.contactName}</p><p className="text-xs text-gray-400">{l.contactEmail}</p></td>
                  <td className="px-4 py-3">
                    <select value={l.stage} onChange={(e) => updateLead(l.id, { stage: e.target.value as LeadStage })} className={`px-2 py-0.5 rounded-full text-xs font-bold border cursor-pointer ${STAGE_COLORS[l.stage]}`}>
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{l.source}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-gray-700">${l.estimatedValue.toLocaleString('es-AR')}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openEdit(l)} className="p-1 text-gray-400 hover:text-blue-600"><Edit3 size={14} /></button>
                    <button onClick={() => deleteLead(l.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-10 text-center text-gray-400"><Users size={40} className="mx-auto mb-2 opacity-30" /><p>Sin leads. Creá el primero.</p></div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center"><h3 className="font-bold text-lg">{editingLead ? 'Editar Lead' : 'Nuevo Lead'}</h3><button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Empresa</label><input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-violet-500/30 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Nombre Contacto</label><input value={form.contactName || ''} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-violet-500/30 focus:outline-none" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Email</label><input type="email" value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-violet-500/30 focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Teléfono</label><input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Origen</label><select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })} className="w-full px-3 py-2 border rounded-lg text-sm">{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Etapa</label><select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })} className="w-full px-3 py-2 border rounded-lg text-sm">{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Valor Estimado ($)</label><input type="number" value={form.estimatedValue || 0} onChange={(e) => setForm({ ...form, estimatedValue: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Servicio Interesado</label><input value={form.interestedService || ''} onChange={(e) => setForm({ ...form, interestedService: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Notas</label><textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-violet-500/30 focus:outline-none" /></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 flex items-center gap-2 shadow-md"><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
