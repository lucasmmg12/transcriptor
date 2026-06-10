'use client';

import { useAdminStore } from '../../../lib/store';
import { Settings, Shield, Database, Trash2, Download, RefreshCw, Zap } from 'lucide-react';
import { initialTasks } from '../../../lib/seed-data';

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
    <div className="space-y-6 max-w-3xl pb-20">
      {/* Header Banner - Cinematográfico */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/50 via-gray-800/20 to-gray-950/30 p-6 text-white shadow-2xl backdrop-blur-md">
        <div className="absolute -right-6 -top-6 text-white/5 pointer-events-none">
          <Settings size={160} className="rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Settings size={28} className="text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            Configuración del Sistema
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gestión de base de datos local, backups, y credenciales administrativas.
          </p>
        </div>
      </div>

      {/* Stats - Grid Adaptable para móvil */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <Database size={16} className="text-gray-400" /> Estado de Datos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-white/[0.02] border border-white/5 rounded-xl p-3.5 hover:bg-white/5 hover:border-white/10 transition-all">
              <p className="text-2xl font-mono font-black text-white">{s.count}</p>
              <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <h3 className="font-bold text-white flex items-center gap-2 mb-2">
          <Download size={16} className="text-emerald-400" /> Copia de Seguridad (Backup)
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Descargá un archivo backup estructurado en formato JSON con la totalidad de los datos locales de la plataforma.
        </p>
        <button 
          onClick={exportData} 
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <Download size={15} /> Exportar Backup JSON
        </button>
      </div>

      {/* Reset y Mantenimiento */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <RefreshCw size={16} className="text-amber-400" /> Restablecimiento y Purga
        </h3>
        <div className="divide-y divide-white/5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <p className="text-sm font-bold text-gray-200">Restablecer Matriz de Tareas</p>
              <p className="text-xs text-gray-500">Vuelve a restaurar las tareas originales cargadas del Excel.</p>
            </div>
            <button 
              onClick={resetTasks} 
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <RefreshCw size={13} /> Resetear Tareas
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <p className="text-sm font-bold text-gray-200">Limpiar CRM de Leads</p>
              <p className="text-xs text-gray-500">Elimina permanentemente todos los leads y contactos comerciales.</p>
            </div>
            <button 
              onClick={clearLeads} 
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <Trash2 size={13} /> Limpiar Leads
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <p className="text-sm font-bold text-gray-200">Limpiar Proyectos</p>
              <p className="text-xs text-gray-500">Purga la totalidad de los proyectos de desarrollo y producción.</p>
            </div>
            <button 
              onClick={clearProjects} 
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <Trash2 size={13} /> Limpiar Proyectos
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
            <div>
              <p className="text-sm font-bold text-gray-200">Limpiar Bitácora de Reuniones</p>
              <p className="text-xs text-gray-500">Elimina todas las minutas y actas de acuerdos guardadas.</p>
            </div>
            <button 
              onClick={clearMeetings} 
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <Trash2 size={13} /> Limpiar Reuniones
            </button>
          </div>

        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl">
        <h3 className="font-bold text-white flex items-center gap-2 mb-3">
          <Shield size={16} className="text-indigo-400" /> Credenciales de Acceso Administrativo
        </h3>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2 font-mono text-sm">
          <p className="text-gray-300">
            <span className="text-gray-500 font-sans font-bold">Email:</span> admin@growlabs.com
          </p>
          <p className="text-gray-300">
            <span className="text-gray-500 font-sans font-bold">Contraseña:</span> growlabs2026
          </p>
        </div>
        <p className="text-[10px] text-gray-500 mt-3 italic">
          Para modificar los datos de sesión, edite la configuración de variables en el archivo local `src/lib/store.ts`.
        </p>
      </div>

      {/* Footer Branding */}
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-white/5 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Zap size={22} className="text-white animate-pulse" />
        </div>
        <h3 className="font-black tracking-widest text-white text-base">GROW LABS</h3>
        <p className="text-gray-500 text-xs mt-1">Sistema de Gestión Interno v1.0.0</p>
        <div className="w-24 h-[1px] bg-white/10 mx-auto my-3" />
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">SISTEMA CREADO POR GROW LABS</p>
      </div>
    </div>
  );
}
