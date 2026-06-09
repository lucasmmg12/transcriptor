import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Lead, Project, TeamMember, Meeting, AdminUser } from './types';
import { initialTasks, initialTeamMembers } from './seed-data';

interface AdminStore {
  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Projects
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Team
  team: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Meetings
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@growlabs.com',
  password: 'growlabs2026',
  user: {
    email: 'admin@growlabs.com',
    name: 'Admin Grow Labs',
    role: 'admin' as const,
  },
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      // Auth
      isAuthenticated: false,
      currentUser: null,
      login: (email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true, currentUser: ADMIN_CREDENTIALS.user });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),

      // Tasks
      tasks: initialTasks,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      // Leads
      leads: [],
      addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deleteLead: (id) =>
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),

      // Projects
      projects: [],
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

      // Team
      team: initialTeamMembers,
      addTeamMember: (member) => set((state) => ({ team: [...state.team, member] })),
      updateTeamMember: (id, updates) =>
        set((state) => ({
          team: state.team.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deleteTeamMember: (id) =>
        set((state) => ({ team: state.team.filter((m) => m.id !== id) })),

      // Meetings
      meetings: [],
      addMeeting: (meeting) => set((state) => ({ meetings: [...state.meetings, meeting] })),
      updateMeeting: (id, updates) =>
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deleteMeeting: (id) =>
        set((state) => ({ meetings: state.meetings.filter((m) => m.id !== id) })),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'growlabs-admin-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        tasks: state.tasks,
        leads: state.leads,
        projects: state.projects,
        team: state.team,
        meetings: state.meetings,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
