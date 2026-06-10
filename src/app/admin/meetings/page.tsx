'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Meeting, MeetingType, MeetingStatus, Decision } from '../../../lib/types';
import { Calendar, Plus, X, Save, Edit3, Trash2, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

const MEETING_TYPES: MeetingType[] = ['Semanal', 'Estratégica', 'Comercial', 'Proyecto', 'Interna'];
const MEETING_STATUSES: MeetingStatus[] = ['Programada', 'En curso', 'Completada', 'Cancelada'];

const STATUS_COLORS: Record<string, string> = {
  'Programada': 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
  'En curso': 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
  'Completada': 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
  'Cancelada': 'bg-rose-500/10 border border-rose-500/20 text-rose-400',
};

const TYPE_ICONS: Record<string, string> = {
  'Semanal': '📅', 'Estratégica': '🎯', 'Comercial': '💼', 'Proyecto': '🔧', 'Interna': '🏠',
};

export default function MeetingsPage() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useAdminStore();
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
    if (editingMeeting) {
      updateMeeting(editingMeeting.id, form);
    } else {
      addMeeting({
        ...form,
        id: `meet-${Date.now()}`,
        decisions: form.decisions || [],
        attendees: form.attendees || []
      } as Meeting);
    }
    setShowModal(false);
  };

  const addDecision = () => {
    if (!newDecision.trim()) return;
    const d: Decision = {
      id: `dec-${Date.now()}`,
      description: newDecision.trim(),
      responsible: newDecisionResp || 'Sin asignar',
      status: 'Pendiente'
    };
    setForm({ ...form, decisions: [...(form.decisions || []), d] });
    setNewDecision('');
    setNewDecisionResp('');
  };
  
  const removeDecision = (id: string) => setForm({ ...form, decisions: form.decisions?.filter((d) => d.id !== id) });

  const sorted = [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner - Cinematográfico */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-gray-950/30 p-6 text-white shadow-2xl backdrop-blur-md">
        <div className="absolute -right-6 -top-6 text-amber-500/10 pointer-events-none">
          <Calendar size={160} className="rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <Calendar size={28} className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              Reuniones y Decisiones
            </h2>
            <p className="text-amber-200/60 text-sm mt-1">
              Bitácora de actas, acuerdos, y compromisos con responsables asignados.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 self-start md:self-auto backdrop-blur-sm">
            <div className="text-right">
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Compromisos</p>
              <p className="text-lg font-mono font-black text-white">
                {meetings.reduce((s, m) => s + m.decisions.length, 0)} <span className="text-xs font-normal text-amber-200/50">decisiones</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <div className="flex justify-end px-1 sm:px-0">
        <button 
          onClick={openNew} 
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] border border-amber-500/30"
        >
          <Plus size={18} /> Nueva Reunión
        </button>
      </div>

      {/* Listado de Reuniones */}
      <div className="space-y-4">
        {sorted.map((m) => (
          <div 
            key={m.id} 
            className="group relative bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md"
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl p-2 bg-white/5 rounded-xl border border-white/5 shrink-0 block" role="img" aria-label="icono de tipo">
                    {TYPE_ICONS[m.type] || '📋'}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base md:text-lg truncate group-hover:text-amber-200 transition-colors">
                      {m.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="font-mono">
                        {new Date(m.date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-amber-300 rounded-lg font-bold">
                        {m.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Controles y Status */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[m.status]}`}>
                    {m.status}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEdit(m)} 
                      className="p-2 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Editar"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button 
                      onClick={() => deleteMeeting(m.id)} 
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decisiones Tomadas */}
              {m.decisions.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-xs font-black text-amber-400/70 uppercase tracking-widest mb-3">
                    Acuerdos y Decisiones ({m.decisions.length})
                  </p>
                  <div className="space-y-2.5">
                    {m.decisions.map((d) => (
                      <div 
                        key={d.id} 
                        className="flex items-start gap-3 text-sm bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl p-3 transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          d.status === 'Completada' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : d.status === 'En curso' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-white/5 text-gray-500 border border-white/10'
                        }`}>
                          {d.status === 'Completada' ? <CheckCircle2 size={12} /> : d.status === 'En curso' ? <Clock size={12} /> : <AlertCircle size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 font-medium leading-relaxed">{d.description}</p>
                          <p className="text-xs text-indigo-300/60 font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                            <span className="text-gray-500 font-normal">Responsable:</span> {d.responsible}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Próximos Pasos */}
              {m.nextSteps && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                    Próximos Pasos sugeridos
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed bg-white/[0.01] border border-white/5 rounded-xl p-3">
                    {m.nextSteps}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {meetings.length === 0 && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-16 text-center text-gray-400 shadow-xl backdrop-blur-md">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-20 text-amber-400 animate-pulse" />
          <p className="font-bold text-lg text-white">Sin reuniones registradas</p>
          <p className="text-sm text-gray-500 mt-1">Cada reunión presencial o virtual debe finalizar con acuerdos y responsables concretos.</p>
        </div>
      )}

      {/* Modal - Edición / Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-950 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-lg text-white">
                {editingMeeting ? 'Editar Minuta de Reunión' : 'Registrar Nueva Reunión'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Tema / Título Principal</label>
                <input 
                  type="text"
                  value={form.topic || ''} 
                  onChange={(e) => setForm({ ...form, topic: e.target.value })} 
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  placeholder="Ej. Planificación de Sprint o Diagnóstico de Proceso"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Fecha</label>
                  <input 
                    type="date" 
                    value={form.date || ''} 
                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Tipo de Sesión</label>
                  <select 
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value as MeetingType })} 
                    className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  >
                    {MEETING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Estado actual</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value as MeetingStatus })} 
                    className="w-full px-3 py-2 bg-gray-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  >
                    {MEETING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Registro de Decisiones en Modal */}
              <div className="border-t border-white/5 pt-4">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1.5">Añadir Acuerdos / Decisiones</label>
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input 
                    type="text"
                    value={newDecision} 
                    onChange={(e) => setNewDecision(e.target.value)} 
                    placeholder="¿Qué se decidió o acordó?" 
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  <input 
                    type="text"
                    value={newDecisionResp} 
                    onChange={(e) => setNewDecisionResp(e.target.value)} 
                    placeholder="Responsable" 
                    className="w-full sm:w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={addDecision} 
                    className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 rounded-xl text-sm font-bold text-amber-300 transition-all active:scale-95 shrink-0"
                  >
                    Agregar
                  </button>
                </div>

                {form.decisions && form.decisions.length > 0 && (
                  <div className="space-y-1.5 bg-white/[0.02] border border-white/5 rounded-xl p-2.5 max-h-40 overflow-y-auto">
                    {form.decisions.map((d) => (
                      <div key={d.id} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-xl text-sm border border-white/5 gap-2">
                        <div className="min-w-0">
                          <p className="text-gray-200 truncate font-medium">{d.description}</p>
                          <p className="text-xs text-amber-300/60 font-bold">Responsable: {d.responsible}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeDecision(d.id)} 
                          className="text-gray-400 hover:text-rose-500 p-1 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Próximos Pasos</label>
                <textarea 
                  value={form.nextSteps || ''} 
                  onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} 
                  rows={2} 
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  placeholder="Acciones sugeridas post-reunión..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Notas Internas</label>
                <textarea 
                  value={form.notes || ''} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  rows={2} 
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  placeholder="Detalles del debate, contexto, etc."
                />
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
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <Save size={14} /> Guardar Reunión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
