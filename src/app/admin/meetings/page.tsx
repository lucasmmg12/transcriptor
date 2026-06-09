'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Meeting, MeetingType, MeetingStatus, Decision } from '../../../lib/types';
import { Calendar, Plus, X, Save, Edit3, Trash2, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

const MEETING_TYPES: MeetingType[] = ['Semanal', 'Estratégica', 'Comercial', 'Proyecto', 'Interna'];
const MEETING_STATUSES: MeetingStatus[] = ['Programada', 'En curso', 'Completada', 'Cancelada'];
const STATUS_COLORS: Record<string, string> = {
  'Programada': 'bg-blue-100 text-blue-700', 'En curso': 'bg-amber-100 text-amber-700',
  'Completada': 'bg-emerald-100 text-emerald-700', 'Cancelada': 'bg-red-100 text-red-700',
};
const TYPE_ICONS: Record<string, string> = {
  'Semanal': '📅', 'Estratégica': '🎯', 'Comercial': '💼', 'Proyecto': '🔧', 'Interna': '🏠',
};

export default function MeetingsPage() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting, team } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [form, setForm] = useState<Partial<Meeting>>({});
  const [newDecision, setNewDecision] = useState('');
  const [newDecisionResp, setNewDecisionResp] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const openNew = () => {
    setEditingMeeting(null);
    setForm({ date: today, type: 'Semanal', status: 'Programada', attendees: [], decisions: [], topic: '', nextSteps: '' });
    setShowModal(true);
  };
  const openEdit = (m: Meeting) => { setEditingMeeting(m); setForm({ ...m }); setShowModal(true); };
  const handleSave = () => {
    if (!form.topic || !form.date) return;
    if (editingMeeting) { updateMeeting(editingMeeting.id, form); }
    else { addMeeting({ ...form, id: `meet-${Date.now()}`, decisions: form.decisions || [], attendees: form.attendees || [] } as Meeting); }
    setShowModal(false);
  };
  const addDecision = () => {
    if (!newDecision.trim()) return;
    const d: Decision = { id: `dec-${Date.now()}`, description: newDecision.trim(), responsible: newDecisionResp || 'Sin asignar', status: 'Pendiente' };
    setForm({ ...form, decisions: [...(form.decisions || []), d] });
    setNewDecision('');
    setNewDecisionResp('');
  };
  const removeDecision = (id: string) => setForm({ ...form, decisions: form.decisions?.filter((d) => d.id !== id) });

  const sorted = [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Calendar size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><Calendar size={24} /> Reuniones y Decisiones</h2>
          <p className="text-amber-100 text-sm mt-1">{meetings.length} reuniones · {meetings.reduce((s, m) => s + m.decisions.length, 0)} decisiones registradas</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={openNew} className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-amber-700 transition-all shadow-md"><Plus size={16} /> Nueva Reunión</button>
      </div>

      <div className="space-y-4">
        {sorted.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{TYPE_ICONS[m.type] || '📋'}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{m.topic}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{new Date(m.date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">{m.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                  <button onClick={() => openEdit(m)} className="p-1 text-gray-400 hover:text-blue-600"><Edit3 size={14} /></button>
                  <button onClick={() => deleteMeeting(m.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>

              {m.decisions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Decisiones ({m.decisions.length})</p>
                  <div className="space-y-2">
                    {m.decisions.map((d) => (
                      <div key={d.id} className="flex items-start gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${d.status === 'Completada' ? 'bg-emerald-100 text-emerald-600' : d.status === 'En curso' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                          {d.status === 'Completada' ? <CheckCircle2 size={10} /> : d.status === 'En curso' ? <Clock size={10} /> : <AlertCircle size={10} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700">{d.description}</p>
                          <p className="text-xs text-gray-400">{d.responsible}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.nextSteps && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Próximos Pasos</p>
                  <p className="text-sm text-gray-600">{m.nextSteps}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 shadow-sm">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-30" /><p className="font-medium">Sin reuniones registradas</p><p className="text-sm">Cada reunión debe terminar con decisión, responsable y fecha.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center"><h3 className="font-bold text-lg">{editingMeeting ? 'Editar Reunión' : 'Nueva Reunión'}</h3><button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Tema</label><input value={form.topic || ''} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Fecha</label><input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Tipo</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MeetingType })} className="w-full px-3 py-2 border rounded-lg text-sm">{MEETING_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label className="text-xs font-bold text-gray-500 block mb-1">Estado</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MeetingStatus })} className="w-full px-3 py-2 border rounded-lg text-sm">{MEETING_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Decisiones</label>
                <div className="flex gap-2 mb-2">
                  <input value={newDecision} onChange={(e) => setNewDecision(e.target.value)} placeholder="Decisión..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                  <input value={newDecisionResp} onChange={(e) => setNewDecisionResp(e.target.value)} placeholder="Responsable" className="w-32 px-3 py-2 border rounded-lg text-sm" />
                  <button type="button" onClick={addDecision} className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-200">+</button>
                </div>
                {form.decisions && form.decisions.length > 0 && (
                  <div className="space-y-1">
                    {form.decisions.map((d) => (
                      <div key={d.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                        <div><p className="text-gray-700">{d.description}</p><p className="text-xs text-gray-400">{d.responsible}</p></div>
                        <button onClick={() => removeDecision(d.id)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Próximos Pasos</label><textarea value={form.nextSteps || ''} onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs font-bold text-gray-500 block mb-1">Notas</label><textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 flex items-center gap-2 shadow-md"><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
