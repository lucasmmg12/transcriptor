'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Zap, Search, ExternalLink, Calendar, Building2, User, Mail, Briefcase } from 'lucide-react';
import Link from 'next/link';

type DiagnosticLead = {
  id: string;
  created_at: string;
  company_name: string;
  full_name?: string;
  contact_name?: string;
  email?: string;
  contact_email?: string;
  whatsapp?: string;
  role?: string;
  contact_role?: string;
  industry?: string;
  total_score?: number;
  score?: number;
  maturity_level: string;
  token: string;
};

export default function GrowIqAdminPage() {
  const [leads, setLeads] = useState<DiagnosticLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('grow_iq_diagnostics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads(data || []);
      }
      setIsLoading(false);
    }

    fetchLeads();
  }, []);

  const filtered = leads.filter(l => {
    const company = l.company_name || '';
    const name = l.full_name || l.contact_name || '';
    const email = l.email || l.contact_email || '';
    const query = search.toLowerCase();
    return company.toLowerCase().includes(query) || name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  });

  const getMaturityColor = (level: string) => {
    switch(level) {
      case 'Crítico': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Inicial': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'En Desarrollo': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Maduro': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Líder': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><Zap size={120} /></div>
        <div className="relative z-10">
          <h2 className="font-black text-2xl flex items-center gap-2"><Zap size={24} className="text-emerald-400" /> Diagnósticos Grow IQ</h2>
          <p className="text-gray-400 text-sm mt-1">
            Total de empresas evaluadas: <span className="font-mono font-bold text-emerald-400">{leads.length}</span>
          </p>
        </div>
      </div>

      {/* Controls Box */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-grow max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Buscar empresa, contacto o email..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all" 
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[1000px]">
          <thead className="bg-white/[0.02] border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Empresa / Industria</th>
              <th className="px-5 py-4">Contacto</th>
              <th className="px-5 py-4 text-center">Score</th>
              <th className="px-5 py-4">Nivel de Madurez</th>
              <th className="px-5 py-4 text-right">Fecha</th>
              <th className="px-5 py-4 text-center w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">
                  <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                  Cargando diagnósticos...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">
                  <Zap size={44} className="mx-auto mb-3 opacity-20 text-emerald-400" />
                  <p className="font-semibold text-gray-300">No hay diagnósticos registrados</p>
                  <p className="text-xs text-gray-500 mt-1">Cuando los usuarios completen Grow IQ, aparecerán aquí.</p>
                </td>
              </tr>
            ) : (
              filtered.map((l) => {
                const contactName = l.full_name || l.contact_name || '-';
                const contactEmail = l.email || l.contact_email || '-';
                const contactRole = l.role || l.contact_role || '';
                const score = l.total_score ?? l.score ?? 0;

                return (
                  <tr key={l.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-gray-500" />
                        <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{l.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Briefcase size={12} />
                        {l.industry || 'General'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-500" />
                        <span className="text-gray-300 font-semibold">{contactName}</span>
                        {contactRole && <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 ml-1">{contactRole}</span>}
                      </div>
                      {contactEmail !== '-' && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Mail size={12} />
                          <a href={`mailto:${contactEmail}`} className="hover:text-emerald-400 transition-colors">{contactEmail}</a>
                        </div>
                      )}
                      {l.whatsapp && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Zap size={12} />
                          <a href={`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`} target="_blank" className="hover:text-emerald-400 transition-colors">{l.whatsapp}</a>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-lg font-black text-white">{score}</span>
                      <span className="text-xs text-gray-500">/100</span>
                    </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getMaturityColor(l.maturity_level)}`}>
                      {l.maturity_level}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-gray-400">
                    <div className="flex items-center justify-end gap-1.5">
                      <Calendar size={12} />
                      {new Date(l.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link 
                      href={`/grow-iq/resultados/${l.token}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 border border-gray-700 hover:border-emerald-500 text-gray-300 hover:text-white rounded-lg transition-all text-xs font-bold"
                    >
                      <ExternalLink size={14} />
                      Reporte
                    </Link>
                  </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
