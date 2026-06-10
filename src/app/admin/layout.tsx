'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '../../lib/store';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListChecks,
  UserCog,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads & CRM', icon: Users },
  { href: '/admin/projects', label: 'Proyectos', icon: FolderKanban },
  { href: '/admin/tasks', label: 'Matriz de Control', icon: ListChecks },
  { href: '/admin/team', label: 'Equipo', icon: UserCog },
  { href: '/admin/meetings', label: 'Reuniones', icon: Calendar },
  { href: '/admin/settings', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, currentUser, logout, sidebarCollapsed, toggleSidebar } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  // If on login page, don't show layout
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  const mobileNavItems = [
    { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads', icon: Users },
    { href: '/admin/projects', label: 'Proyectos', icon: FolderKanban },
    { href: '/admin/tasks', label: 'Tareas', icon: ListChecks },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex text-gray-100 font-sans">
      {/* Mobile Menu Bottom Sheet (More Option) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-gray-900 border-t border-gray-800 rounded-t-2xl max-h-[80vh] overflow-y-auto p-6 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800">
              <div>
                <h3 className="font-black text-white text-base">Grow Labs</h3>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/team"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/30 transition-all text-center"
              >
                <UserCog className="text-emerald-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-300">Equipo</span>
              </Link>
              <Link
                href="/admin/meetings"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/30 transition-all text-center"
              >
                <Calendar className="text-emerald-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-300">Reuniones</span>
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-emerald-500/30 transition-all text-center"
              >
                <Settings className="text-emerald-400 mb-2" size={24} />
                <span className="text-xs font-bold text-gray-300">Ajustes</span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 hover:border-red-500/30 transition-all text-center"
              >
                <LogOut className="text-red-400 mb-2" size={24} />
                <span className="text-xs font-bold text-red-300">Salir</span>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-950 rounded-xl border border-gray-800/50">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {currentUser?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-200 truncate">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar (Only shown on Desktop, collapses appropriately) */}
      <aside
        className={`
          hidden lg:flex sticky top-0 left-0 z-40 h-screen
          bg-gray-900 border-r border-gray-800/60
          flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-gray-800/60 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-black text-white text-sm tracking-tight">GROW LABS</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
              Módulos
            </p>
          )}
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {!sidebarCollapsed && item.label}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800/60">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {currentUser?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-300 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
              </div>
            </div>
          )}
          <div className="flex gap-1">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${sidebarCollapsed ? 'w-full justify-center' : 'flex-1'}`}
            >
              <LogOut size={16} />
              {!sidebarCollapsed && 'Salir'}
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen pb-24 lg:pb-0 overflow-x-hidden">
        {/* Top Header Mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-900 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-white">GROW LABS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
              {currentUser?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Content wrapper */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <nav className="bg-gray-900/90 border border-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-around py-2.5 px-4 shadow-xl shadow-black/40">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 p-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-emerald-400' : 'text-gray-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'scale-110 text-emerald-400' : 'text-gray-400'} />
                <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1 p-1 rounded-xl text-gray-400 hover:text-white"
          >
            <Menu size={20} />
            <span className="text-[9px] font-bold tracking-tight">Más</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
