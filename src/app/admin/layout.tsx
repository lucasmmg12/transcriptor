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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950
          border-r border-gray-800
          flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-gray-800 flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap size={18} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-black text-white text-sm tracking-tight">GROW LABS</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Control Panel</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">
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
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
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
        <div className="p-3 border-t border-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {currentUser?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-300 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-gray-600 truncate">{currentUser?.email}</p>
              </div>
            </div>
          )}
          <div className="flex gap-1">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all ${sidebarCollapsed ? 'w-full justify-center' : 'flex-1'}`}
            >
              <LogOut size={16} />
              {!sidebarCollapsed && 'Salir'}
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Top bar mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu size={22} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-800">GROW LABS</span>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
