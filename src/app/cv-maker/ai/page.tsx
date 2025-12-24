"use client";

import React, { useState } from 'react';
import CVEditor, { GENERIC_DATA, CVData } from '@/components/CVEditor';
import Link from 'next/link';
import Image from 'next/image';

export default function AiCVPage() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState<CVData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generar-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar el CV');
            }

            setGeneratedData(data.data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error al procesar tu solicitud.');
        } finally {
            setLoading(false);
        }
    };

    // Si ya tenemos datos generados, mostramos el editor
    if (generatedData) {
        return <CVEditor initialData={generatedData} />;
    }

    // Si no, mostramos el formulario de entrada IA
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative selection:bg-purple-500 selection:text-white">

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-3xl w-full">

                {/* Header Section */}
                <div className="mb-10 text-center animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
                            <Image
                                src="/logogrow.png"
                                alt="Grow Labs Logo"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        CV <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Optimizado con IA</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Transformamos tu experiencia en un currículum profesional de alto impacto. Sin plantillas genéricas, potenciado por GPT-4.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl animate-slide-in">

                    {/* Tips Section */}
                    <div className="mb-8 p-5 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-4">
                        <div className="shrink-0 mt-1">
                            <i className="fas fa-lightbulb text-blue-400 text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-400 mb-2 text-sm uppercase tracking-wide">Consejos para un mejor resultado</h4>
                            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside marker:text-blue-500/50">
                                <li>Menciona fechas aproximadas y nombres de empresas.</li>
                                <li>Si tienes logros medibles (ventas, personas a cargo), ¡inclúyelos!</li>
                                <li>No te preocupes por el orden o la ortografía, la IA lo corregirá.</li>
                                <li>Especifica las herramientas o software que sabes usar.</li>
                            </ul>
                        </div>
                    </div>

                    <label className="block text-lg font-bold text-white mb-3">
                        Cuéntame tu historia profesional:
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Soy Juan, ingeniero industrial con 5 años de experiencia en logística. Trabajé en Transporte Global coordinando rutas y reduciendo costos un 15%. Antes fui analista de calidad en Industria Metalúrgica. Hablo inglés avanzado y manejo SAP..."
                        className="w-full h-56 p-5 bg-black/40 border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none mb-6 leading-relaxed"
                    />

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                            <i className="fas fa-exclamation-circle text-lg"></i>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-purple-900/20 transform transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Optimizando tu perfil...</span>
                            </>
                        ) : (
                            <>
                                <span>Generar CV Profesional</span>
                                <i className="fas fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i>
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Powered by Grow Labs AI Engine
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/cv-maker" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-arrow-left"></i> Volver a elegir modo
                    </Link>
                </div>
            </div>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
