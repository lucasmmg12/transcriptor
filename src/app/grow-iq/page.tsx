import React from 'react';
import Header from '@/components/Header';
import GrowIqWizard from '@/components/grow-iq/GrowIqWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grow IQ | Diagnóstico Empresarial Gratuito',
  description: 'Medí el nivel de madurez operativa, digital y tecnológica de tu organización y recibí recomendaciones personalizadas para mejorarla.',
};

export default function GrowIqPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0d] selection:bg-emerald-500/30">
      <Header />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-sm mb-4 border border-emerald-500/20">
              Diagnóstico empresarial gratuito
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Descubrí el Grow IQ de tu empresa
            </h1>
            <p className="text-lg text-gray-400">
              Medí el nivel de madurez operativa, digital y tecnológica de tu organización y recibí recomendaciones personalizadas para mejorarla.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-1.5"><i className="far fa-clock"></i> Menos de 5 minutos</div>
              <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center gap-1.5"><i className="fas fa-bolt"></i> Resultado inmediato</div>
              <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center gap-1.5"><i className="far fa-file-alt"></i> Informe personalizado</div>
              <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></div>
              <div className="flex items-center gap-1.5"><i className="fas fa-tag"></i> 100% gratuito</div>
            </div>
          </div>

          {/* Wizard */}
          <GrowIqWizard />
          
          <div className="text-center mt-12 text-sm text-gray-600 max-w-2xl mx-auto">
            Las respuestas serán utilizadas para generar el diagnóstico y mejorar las comparaciones estadísticas entre empresas de forma anónima. El resultado es una herramienta orientativa y no constituye una auditoría o certificación profesional.
          </div>
        </div>
      </div>
    </main>
  );
}
