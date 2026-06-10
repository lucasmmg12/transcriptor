'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '../../../lib/store';
import { Proposal } from '../../../lib/types';
import { 
  FileText, 
  Plus, 
  X, 
  Search, 
  DollarSign, 
  Trash2, 
  Eye, 
  Printer, 
  Sparkles, 
  Briefcase, 
  FileCheck, 
  ArrowLeft,
  Loader2,
  Calendar,
  Building
} from 'lucide-react';

export default function PropuestasPage() {
  const { 
    proposals, 
    leads, 
    projects, 
    fetchProposals, 
    addProposal, 
    deleteProposal,
    isLoading 
  } = useAdminStore();

  const [search, setSearch] = useState('');
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  
  // Variables del formulario del generador
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [customClientName, setCustomClientName] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');
  const [valueArsInput, setValueArsInput] = useState('');
  const [operatorNotes, setOperatorNotes] = useState('');

  // Estados de carga de la IA
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    fetchProposals().catch(console.error);
  }, []);

  // Pasos del loader de la IA
  const loaderSteps = [
    "Analizando el historial de reuniones recientes con el cliente...",
    "Buscando memoria acumulada de cotizaciones y propuestas previas...",
    "Analizando fricciones y necesidades de orden de procesos...",
    "Redactando justificación metodológica de escala y transición...",
    "Estructurando inversión final en pesos argentinos (ARS)...",
    "Generando propuesta técnica final..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loaderSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Filtrado de propuestas
  const filteredProposals = proposals.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.clientName.toLowerCase().includes(term) ||
      p.projectName.toLowerCase().includes(term) ||
      p.title.toLowerCase().includes(term)
    );
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generar-propuesta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: selectedLeadId || undefined,
          projectId: selectedProjectId || undefined,
          notes: operatorNotes,
          valueArs: valueArsInput ? Number(valueArsInput) : undefined,
          clientNameCustom: customClientName || undefined,
          projectNameCustom: customProjectName || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Fallo al generar propuesta');
      }

      const data = await response.json();
      if (data.success && data.proposal) {
        // Añadir localmente en Zustand
        await fetchProposals();
        // Mostrar propuesta generada en pantalla
        setSelectedProposal(data.proposal);
        setShowGeneratorModal(false);
        // Resetear formulario
        setSelectedLeadId('');
        setSelectedProjectId('');
        setCustomClientName('');
        setCustomProjectName('');
        setValueArsInput('');
        setOperatorNotes('');
      }
    } catch (error) {
      console.error('Error al generar propuesta comercial con IA:', error);
      alert('Ocurrió un error al generar la propuesta. Por favor intente de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta propuesta? Se borrará permanentemente.')) {
      try {
        await deleteProposal(id);
      } catch (error) {
        console.error('Error al eliminar propuesta:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Estilo para impresión limpia */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 2rem;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Vista Principal */}
      {!selectedProposal ? (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-gray-950 rounded-2xl p-6 text-white border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5"><FileText size={120} /></div>
            <div className="relative z-10">
              <h2 className="font-black text-2xl flex items-center gap-2">
                <FileText size={24} className="text-blue-400" /> Propuestas Comerciales
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Generá y gestioná propuestas técnicas y comerciales con Inteligencia Artificial utilizando contexto y memoria de reuniones.
              </p>
            </div>
          </div>

          {/* Controls Box */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-grow">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Buscar propuesta por cliente, título o proyecto..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all" 
              />
            </div>
            <button 
              onClick={() => setShowGeneratorModal(true)} 
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Sparkles size={16} className="text-blue-200 animate-pulse" /> 
              <span>Generar con IA</span>
            </button>
          </div>

          {/* Proposals List */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Historial de Propuestas Generadas</h3>
              <span className="text-xs font-mono text-gray-400">{filteredProposals.length} propuestas</span>
            </div>

            {filteredProposals.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FileText size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">No hay propuestas comerciales registradas</p>
                <p className="text-xs text-gray-600 mt-1">Hacé clic en "Generar con IA" para redactar tu primera propuesta técnica.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredProposals.map((proposal) => (
                  <div 
                    key={proposal.id} 
                    onClick={() => setSelectedProposal(proposal)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] cursor-pointer transition-all duration-150 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {proposal.location}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{proposal.date}</span>
                      </div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-base">
                        {proposal.title}
                      </h4>
                      <p className="text-sm text-gray-400 flex items-center gap-1.5">
                        <span className="font-semibold text-gray-300">{proposal.clientName}</span>
                        <span className="text-gray-600">•</span>
                        <span>{proposal.projectName}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Inversión Estimada</span>
                        <span className="font-mono font-bold text-emerald-400 text-lg">
                          ${Number(proposal.valueArs).toLocaleString('es-AR')} ARS
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProposal(proposal); }}
                          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
                          title="Ver propuesta"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(proposal.id, e)}
                          className="p-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/10 rounded-lg transition-all"
                          title="Eliminar propuesta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Vista Detallada de Propuesta (Previsualización estilo documento ejecutivo de Grow Labs) */
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <button 
              onClick={() => setSelectedProposal(null)}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Volver al listado
            </button>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-700 transition-all active:scale-95"
              >
                <Printer size={16} /> Imprimir / Guardar PDF
              </button>
              <button 
                onClick={() => setSelectedProposal(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-500 transition-all active:scale-95"
              >
                Listo
              </button>
            </div>
          </div>

          {/* Hoja de Propuesta Imprimible */}
          <div 
            id="print-area" 
            className="bg-white text-gray-900 border border-gray-200 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 max-w-4xl mx-auto"
          >
            {/* Cabecera Corporativa */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-gray-200 gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2">
                  GROW <span className="text-blue-600">LABS</span>
                </h1>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                  INGENIERÍA DE PROCESOS & ESCALA
                </p>
              </div>
              <div className="text-left md:text-right text-sm text-gray-500 space-y-0.5">
                <p className="font-bold text-gray-800">Propuesta Técnico-Comercial</p>
                <p>Fecha: {selectedProposal.date}</p>
                <p>Ubicación: {selectedProposal.location}</p>
                <p className="font-mono text-xs text-gray-400">Ref: {selectedProposal.id}</p>
              </div>
            </div>

            {/* Título Principal */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {selectedProposal.title}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                <p className="flex items-center gap-1.5">
                  <Building size={16} className="text-gray-400" /> Cliente: <span className="font-bold text-gray-900">{selectedProposal.clientName}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Briefcase size={16} className="text-gray-400" /> Plataforma: <span className="font-bold text-gray-900">{selectedProposal.projectName}</span>
                </p>
              </div>
            </div>

            {/* Resumen / Idea Central */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Resumen de Valor e Idea Central
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base italic font-medium">
                "{selectedProposal.mainIdea}"
              </p>
            </div>

            {/* Objetivos Estratégicos */}
            {selectedProposal.detailsJson?.objectives && selectedProposal.detailsJson.objectives.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <FileCheck size={16} className="text-blue-600" /> Objetivos de Negocio y Orden
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProposal.detailsJson.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detalles de la Inversión y Módulos */}
            {selectedProposal.detailsJson?.investmentDetails && selectedProposal.detailsJson.investmentDetails.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Desglose Técnico y Evolución de Módulos
                </h3>
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                        <th className="px-5 py-3 w-1/3">Módulo / Concepto</th>
                        <th className="px-5 py-3">Detalle Metodológico e Impacto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedProposal.detailsJson.investmentDetails.map((det, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-900">{det.concept}</td>
                          <td className="px-5 py-4 text-gray-600 leading-relaxed text-xs md:text-sm">{det.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alcance de Soporte y Estructura */}
            {selectedProposal.detailsJson?.scope && selectedProposal.detailsJson.scope.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Infraestructura, Transición y Soporte Mensual
                </h3>
                <ul className="space-y-2">
                  {selectedProposal.detailsJson.scope.map((scp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-600 leading-relaxed">
                      <span className="text-blue-600 font-bold select-none mt-0.5">•</span>
                      <span>{scp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inversión Total */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Monto de Inversión Total Sugerido
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Valores expresados en pesos argentinos (ARS). Válido por 15 días.
                </p>
              </div>
              <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                  VALOR DE LA PROPUESTA
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400 block">
                  ${Number(selectedProposal.valueArs).toLocaleString('es-AR')} ARS
                </span>
              </div>
            </div>

            {/* Footer de Firma */}
            <div className="pt-8 border-t border-gray-200 flex justify-between items-end text-xs text-gray-400">
              <div>
                <p className="font-bold text-gray-600">Lucas Marinero</p>
                <p>Director de Soluciones y Procesos</p>
                <p className="text-[10px] text-gray-400">Grow Labs</p>
              </div>
              <p className="italic text-[10px]">
                "No construimos software, ordenamos el crecimiento de tu organización."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Generador con IA */}
      {showGeneratorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400 animate-pulse" /> Generador de Propuesta con IA
              </h3>
              <button 
                onClick={() => setShowGeneratorModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {isGenerating ? (
              /* Loader Premium en Proceso */
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <Sparkles size={24} className="text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="font-bold text-white text-base">Redactando Propuesta Inteligente</h4>
                  <p className="text-sm text-blue-400 font-medium transition-all duration-300 min-h-[40px]">
                    {loaderSteps[loadingStep]}
                  </p>
                  <p className="text-xs text-gray-600">
                    Esto puede tomar hasta un minuto ya que leemos reuniones anteriores de la base de datos para dotar al modelo de la mayor fidelidad posible.
                  </p>
                </div>
              </div>
            ) : (
              /* Formulario del Generador */
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-2xl text-xs text-blue-300 leading-relaxed">
                  💡 **Memoria del Cliente**: Seleccioná un Lead del CRM para inyectar automáticamente sus requerimientos y buscar en el histórico de reuniones asociadas.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lead del CRM */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Vincular Lead del CRM
                    </label>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => {
                        setSelectedLeadId(e.target.value);
                        if (e.target.value) {
                          const leadObj = leads.find(l => l.id === e.target.value);
                          if (leadObj) {
                            setCustomClientName(leadObj.company);
                            setCustomProjectName(leadObj.interestedService);
                            setValueArsInput(String(leadObj.estimatedValue || ''));
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                    >
                      <option value="">-- No vincular Lead --</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.company} ({l.contactName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proyecto Activo */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Vincular Proyecto Activo
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        if (e.target.value) {
                          const projObj = projects.find(p => p.id === e.target.value);
                          if (projObj) {
                            setCustomClientName(projObj.client);
                            setCustomProjectName(projObj.name);
                            setValueArsInput(String(projObj.value || ''));
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                    >
                      <option value="">-- No vincular Proyecto --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.client})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cliente Manual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Nombre del Cliente / Empresa
                    </label>
                    <input
                      required
                      value={customClientName}
                      onChange={(e) => setCustomClientName(e.target.value)}
                      placeholder="Ej. UOCRA San Juan o Constructora SRL"
                      className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Nombre de la Plataforma
                    </label>
                    <input
                      required
                      value={customProjectName}
                      onChange={(e) => setCustomProjectName(e.target.value)}
                      placeholder="Ej. Módulo de Finanzas & Cheques"
                      className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                    />
                  </div>
                </div>

                {/* Valor en ARS */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Monto de Inversión Sugerido (ARS)
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      value={valueArsInput}
                      onChange={(e) => setValueArsInput(e.target.value)}
                      placeholder="Dejar vacío para estimación automática por la IA"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all"
                    />
                  </div>
                </div>

                {/* Notas de Lucas */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Notas y Directrices del Operador (Opcional)
                  </label>
                  <textarea
                    rows={4}
                    value={operatorNotes}
                    onChange={(e) => setOperatorNotes(e.target.value)}
                    placeholder="Instrucciones específicas. Ej: 'Enfatizar que el operario ya no firmará en papel, sino que escaneará un QR dinámico desde la portería, eliminando la intermediación de planillas de Excel manuales...'"
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowGeneratorModal(false)}
                    className="px-4 py-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Sparkles size={16} /> Redactar Propuesta
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
