'use client';

import { useAdminStore } from '../../../lib/store';
import { Settings, Shield, Database, Trash2, Download, RefreshCw, Zap } from 'lucide-react';
import { initialTasks, initialTeamMembers } from '../../../lib/seed-data';

export default function SettingsPage() {
  const store = useAdminStore();

  const resetTasks = () => {
    if (confirm('¿Resetear todas las tareas a los datos originales del Excel?')) {
      // Reset by clearing and re-adding
      store.tasks.forEach((t) => store.deleteTask(t.id));
      initialTasks.forEach((t) => store.addTask(t));
    }
  };

  const clearLeads = () => {
    if (confirm('¿Eliminar todos los leads?')) {
      store.leads.forEach((l) => store.deleteLead(l.id));
    }
  };

  const clearProjects = () => {
    if (confirm('¿Eliminar todos los proyectos?')) {
      store.projects.forEach((p) => store.deleteProject(p.id));
    }
  };

  const clearMeetings = () => {
    if (confirm('¿Eliminar todas las reuniones?')) {
      store.meetings.forEach((m) => store.deleteMeeting(m.id));
    }
  };

  const exportData = () => {
    const data = {
      tasks: store.tasks,
      leads: store.leads,
      projects: store.projects,
      team: store.team,
      meetings: store.meetings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growlabs-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Tareas', count: store.tasks.length },
    { label: 'Leads', count: store.leads.length },
    { label: 'Proyectos', count: store.projects.length },
    { label: 'Equipo', count: store.team.length },
    { label: 'Reuniones', count: store.meetings.length },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Settings size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-bold text-2xl flex items-center gap-2"><Settings size={24} /> Configuración</h2>
          <p className="text-gray-300 text-sm mt-1">Gestión de datos y sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Database size={16} className="text-gray-500" /> Estado de Datos</h3>
        <div className="grid grid-cols-5 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-black text-gray-800">{s.count}</p>
              <p className="text-xs text-gray-400 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Download size={16} className="text-emerald-500" /> Exportar Datos</h3>
        <p className="text-sm text-gray-500 mb-3">Descargá un backup JSON con todos los datos del sistema.</p>
        <button onClick={exportData} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
          <Download size={14} /> Exportar Backup JSON
        </button>
      </div>

      {/* Reset */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><RefreshCw size={16} className="text-amber-500" /> Resetear Datos</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-700">Resetear Tareas</p><p className="text-xs text-gray-400">Vuelve a las 26 tareas originales del Excel</p></div>
            <button onClick={resetTasks} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-all"><RefreshCw size={12} className="inline mr-1" />Resetear</button>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-700">Limpiar Leads</p><p className="text-xs text-gray-400">Elimina todos los leads del CRM</p></div>
            <button onClick={clearLeads} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"><Trash2 size={12} className="inline mr-1" />Limpiar</button>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-700">Limpiar Proyectos</p><p className="text-xs text-gray-400">Elimina todos los proyectos</p></div>
            <button onClick={clearProjects} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"><Trash2 size={12} className="inline mr-1" />Limpiar</button>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-gray-700">Limpiar Reuniones</p><p className="text-xs text-gray-400">Elimina todas las reuniones</p></div>
            <button onClick={clearMeetings} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-all"><Trash2 size={12} className="inline mr-1" />Limpiar</button>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4"><Shield size={16} className="text-violet-500" /> Credenciales de Acceso</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 font-mono text-sm">
          <p className="text-gray-600"><span className="text-gray-400">Email:</span> admin@growlabs.com</p>
          <p className="text-gray-600"><span className="text-gray-400">Pass:</span> growlabs2026</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">Para cambiar credenciales, editá el archivo src/lib/store.ts</p>
      </div>

      {/* About */}
      <div className="bg-gray-900 rounded-xl p-5 text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Zap size={20} className="text-white" />
        </div>
        <h3 className="font-bold text-white">GROW LABS</h3>
        <p className="text-gray-500 text-xs mt-1">Sistema de Gestión Interno v1.0</p>
        <p className="text-gray-700 text-[10px] mt-3 uppercase tracking-widest">Sistema creado por Grow Labs</p>
      </div>
    </div>
  );
}
