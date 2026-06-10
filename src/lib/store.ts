import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Lead, Project, TeamMember, Meeting, AdminUser, Proposal } from './types';
import { initialTasks, initialTeamMembers } from './seed-data';
import { supabase } from './supabase';

interface AdminStore {
  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Global Sync Status
  isLoading: boolean;
  error: string | null;
  fetchAllData: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchLeads: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchMeetings: () => Promise<void>;
  fetchProposals: () => Promise<void>;
  seedDatabase: () => Promise<void>;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'> & { id?: number }) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;

  // Leads
  leads: Lead[];
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  // Projects
  projects: Project[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Team
  team: TeamMember[];
  addTeamMember: (member: TeamMember) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  // Meetings
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => Promise<void>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;

  // Proposals
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;

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
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      currentUser: null,
      login: (email: string, password: string) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true, currentUser: ADMIN_CREDENTIALS.user });
          // Sincronizar todos los datos de forma asíncrona tras login
          get().fetchAllData().catch(console.error);
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),

      // Sync status
      isLoading: false,
      error: null,

      fetchAllData: async () => {
        set({ isLoading: true, error: null });
        try {
          await Promise.all([
            get().fetchTasks(),
            get().fetchLeads(),
            get().fetchProjects(),
            get().fetchTeam(),
            get().fetchMeetings(),
            get().fetchProposals(),
          ]);

          // Si la base de datos está completamente vacía (por ejemplo, tasks está vacía),
          // sembramos datos iniciales automáticamente para evitar una app vacía.
          if (get().tasks.length === 0 && get().team.length === 0) {
            console.log('Base de datos vacía detectada. Sembrando datos iniciales...');
            await get().seedDatabase();
          }
        } catch (err: any) {
          console.error('Error al sincronizar datos con Supabase:', err);
          set({ error: err.message || 'Error de sincronización' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchTasks: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        set({ tasks: (data || []) as Task[] });
      },

      fetchLeads: async () => {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        set({ leads: (data || []) as Lead[] });
      },

      fetchProjects: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        set({ projects: (data || []) as Project[] });
      },

      fetchTeam: async () => {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        set({ team: (data || []) as TeamMember[] });
      },

      fetchMeetings: async () => {
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        set({ meetings: (data || []) as Meeting[] });
      },

      fetchProposals: async () => {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        set({ proposals: (data || []) as Proposal[] });
      },

      seedDatabase: async () => {
        try {
          // Sembrar Tareas
          const tasksToInsert = initialTasks.map(({ id, ...rest }) => rest);
          const { error: tasksErr } = await supabase.from('tasks').insert(tasksToInsert);
          if (tasksErr) throw tasksErr;

          // Sembrar Miembros de Equipo
          const { error: teamErr } = await supabase.from('team_members').insert(initialTeamMembers);
          if (teamErr) throw teamErr;

          // Recargar datos sembrados
          await get().fetchTasks();
          await get().fetchTeam();
          console.log('Datos iniciales sembrados con éxito en Supabase.');
        } catch (err: any) {
          console.error('Error en seedDatabase:', err);
          throw err;
        }
      },

      // Tasks
      tasks: [],
      addTask: async (task) => {
        const { id, ...taskWithoutId } = task;
        const { data, error } = await supabase
          .from('tasks')
          .insert([taskWithoutId])
          .select();
        
        if (error) {
          console.error('Error al agregar tarea en Supabase:', error);
          throw error;
        }
        if (data && data[0]) {
          set((state) => ({ tasks: [...state.tasks, data[0] as Task] }));
        }
      },
      updateTask: async (id, updates) => {
        const { error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id);
        
        if (error) {
          console.error('Error al actualizar tarea en Supabase:', error);
          throw error;
        }
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },
      deleteTask: async (id) => {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar tarea en Supabase:', error);
          throw error;
        }
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      // Leads
      leads: [],
      addLead: async (lead) => {
        const { error } = await supabase
          .from('leads')
          .insert([lead]);
        
        if (error) {
          console.error('Error al agregar lead en Supabase:', error);
          throw error;
        }
        set((state) => ({ leads: [...state.leads, lead] }));
      },
      updateLead: async (id, updates) => {
        const { error } = await supabase
          .from('leads')
          .update(updates)
          .eq('id', id);
        
        if (error) {
          console.error('Error al actualizar lead en Supabase:', error);
          throw error;
        }
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },
      deleteLead: async (id) => {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar lead en Supabase:', error);
          throw error;
        }
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) }));
      },

      // Projects
      projects: [],
      addProject: async (project) => {
        const { error } = await supabase
          .from('projects')
          .insert([project]);
        
        if (error) {
          console.error('Error al agregar proyecto en Supabase:', error);
          throw error;
        }
        set((state) => ({ projects: [...state.projects, project] }));
      },
      updateProject: async (id, updates) => {
        const { error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id);
        
        if (error) {
          console.error('Error al actualizar proyecto en Supabase:', error);
          throw error;
        }
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProject: async (id) => {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar proyecto en Supabase:', error);
          throw error;
        }
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },

      // Team
      team: [],
      addTeamMember: async (member) => {
        const { error } = await supabase
          .from('team_members')
          .insert([member]);
        
        if (error) {
          console.error('Error al agregar miembro de equipo en Supabase:', error);
          throw error;
        }
        set((state) => ({ team: [...state.team, member] }));
      },
      updateTeamMember: async (id, updates) => {
        const { error } = await supabase
          .from('team_members')
          .update(updates)
          .eq('id', id);
        
        if (error) {
          console.error('Error al actualizar miembro de equipo en Supabase:', error);
          throw error;
        }
        set((state) => ({
          team: state.team.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
      deleteTeamMember: async (id) => {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar miembro de equipo en Supabase:', error);
          throw error;
        }
        set((state) => ({ team: state.team.filter((m) => m.id !== id) }));
      },

      // Meetings
      meetings: [],
      addMeeting: async (meeting) => {
        const { error } = await supabase
          .from('meetings')
          .insert([meeting]);
        
        if (error) {
          console.error('Error al agregar reunión en Supabase:', error);
          throw error;
        }
        set((state) => ({ meetings: [...state.meetings, meeting] }));
      },
      updateMeeting: async (id, updates) => {
        const { error } = await supabase
          .from('meetings')
          .update(updates)
          .eq('id', id);
        
        if (error) {
          console.error('Error al actualizar reunión en Supabase:', error);
          throw error;
        }
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
      deleteMeeting: async (id) => {
        const { error } = await supabase
          .from('meetings')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar reunión en Supabase:', error);
          throw error;
        }
        set((state) => ({ meetings: state.meetings.filter((m) => m.id !== id) }));
      },

      // Proposals
      proposals: [],
      addProposal: async (proposal) => {
        const { error } = await supabase
          .from('proposals')
          .insert([proposal]);
        
        if (error) {
          console.error('Error al agregar propuesta en Supabase:', error);
          throw error;
        }
        set((state) => ({ proposals: [proposal, ...state.proposals] }));
      },
      deleteProposal: async (id) => {
        const { error } = await supabase
          .from('proposals')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error al eliminar propuesta en Supabase:', error);
          throw error;
        }
        set((state) => ({ proposals: state.proposals.filter((p) => p.id !== id) }));
      },

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
        proposals: state.proposals,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
