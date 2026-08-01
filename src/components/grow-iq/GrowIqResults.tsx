'use client';

import React, { useState, useEffect } from 'react';
import { GrowIqLead, AIRecommendation } from '@/lib/types/grow-iq';
import { Download, Calendar, Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GrowIqResults({ token, initialData }: { token: string, initialData: any }) {
  const [data] = useState(initialData);
  const [aiRecs, setAiRecs] = useState<AIRecommendation | null>(initialData.ai_recommendations || null);
  const [loadingAi, setLoadingAi] = useState(!initialData.ai_recommendations);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!initialData.ai_recommendations) {
      // Fetch AI recommendations
      fetch('/api/grow-iq/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.aiRecommendations) {
          setAiRecs(res.aiRecommendations);
        } else {
          setAiRecs(initialData.deterministic_recommendations);
        }
      })
      .catch(() => {
        setAiRecs(initialData.deterministic_recommendations);
      })
      .finally(() => setLoadingAi(false));
    }
  }, [token, initialData]);

  const handleDownloadPdf = () => {
    setGeneratingPdf(true);
    // Para simplificar, la generación completa en jsPDF puede ser un script separado.
    // Usaremos window.print() como fallback amigable para el frontend, o puedes implementar jsPDF completo.
    setTimeout(() => {
      window.print();
      setGeneratingPdf(false);
    }, 500);
  };

  const whatsappMessage = `Hola, completé el diagnóstico Grow IQ de Grow Labs. Mi puntaje fue de \${data.total_score}/100 y me gustaría revisar los resultados.`;
  const whatsappUrl = `https://wa.me/5492645084930?text=\${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-10" id="grow-iq-report">
      {/* Header Results */}
      <div className="bg-[#0f1513] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4 block">Resultado General</span>
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-7xl md:text-8xl font-black text-white">{data.total_score}</h1>
            <span className="text-3xl text-gray-500 font-light mt-4">/ 100</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{data.maturity_level}</h2>
          
          <div className="max-w-2xl mx-auto text-gray-400 mb-8">
            <p><strong>{data.company_name}</strong> - Evaluado por {data.full_name}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={whatsappUrl} target="_blank" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Revisar resultados con Grow Labs
            </a>
            <button onClick={handleDownloadPdf} disabled={generatingPdf} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 transition-all">
              {generatingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Descargar Informe
            </button>
          </div>
        </div>

        {/* Dimension bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/5">
          {data.dimension_scores.map((dim: any, idx: number) => (
            <div key={dim.dimensionId} className={`p-6 md:p-8 \${idx % 2 === 0 ? 'border-r border-white/5' : ''} \${idx < 4 ? 'border-b border-white/5' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-medium">{dim.name}</span>
                <span className="text-emerald-400 font-bold">{dim.score}/100</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full" 
                  style={{ width: `\${dim.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IA Recommendations Section */}
      <div className="bg-[#0f1513] rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <i className="fas fa-sparkles text-emerald-400"></i> Análisis y Recomendaciones
        </h3>
        
        {loadingAi ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p>Generando análisis personalizado con Inteligencia Artificial...</p>
          </div>
        ) : aiRecs ? (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-gray-300 leading-relaxed text-lg bg-white/5 p-6 rounded-2xl border border-white/5">
              {aiRecs.executiveSummary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Principales Fortalezas
                </h4>
                <ul className="space-y-3">
                  {aiRecs.mainStrengths.map((str, i) => (
                    <li key={i} className="flex gap-3 text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-emerald-500 font-bold">•</span> {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Áreas Prioritarias (Cuellos de botella)
                </h4>
                <div className="space-y-4">
                  {aiRecs.priorityAreas.map((area, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <strong className="text-white block mb-1">{area.area}</strong>
                      <p className="text-gray-400 text-sm mb-2">{area.reason}</p>
                      <p className="text-emerald-400 text-sm font-medium">Recomendación: {area.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" /> Plan de Acción Sugerido
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['30Days', '60Days', '90Days'].map((period, idx) => (
                  <div key={period} className="bg-white/5 p-6 rounded-2xl border border-white/5 relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#0a0f0d] border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <h5 className="text-emerald-400 font-bold mb-4 uppercase text-sm tracking-wider">
                      {period === '30Days' ? 'Primeros 30 días' : period === '60Days' ? 'A los 60 días' : 'A los 90 días'}
                    </h5>
                    <ul className="space-y-3">
                      {(aiRecs.actionPlan as any)[period].map((action: string, i: number) => (
                        <li key={i} className="text-gray-400 text-sm flex gap-2">
                          <ArrowRight className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center mt-8">
              <h4 className="text-xl font-bold text-white mb-3">Tu Grow IQ es el punto de partida</h4>
              <p className="text-gray-300 mb-6">{aiRecs.suggestedSolution}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={whatsappUrl} target="_blank" className="btn-grow inline-flex">
                  Revisar mis resultados con Grow Labs
                </a>
                <Link href="/" className="text-gray-400 hover:text-white font-medium transition-colors">
                  Conocer nuestras soluciones
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
