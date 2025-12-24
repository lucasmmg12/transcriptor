"use client";

import React, { useState } from 'react';
import CVEditor, { GENERIC_DATA, CVData } from '@/components/CVEditor';
import Link from 'next/link';

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
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        CV Mágico con IA
                    </h1>
                    <p className="text-gray-400">
                        Describe tu experiencia, estudios y habilidades en tus propias palabras. <br />
                        Nosotros nos encargamos de darle formato profesional.
                    </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-2xl">
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                        Cuéntame sobre ti:
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Soy Juan, ingeniero industrial con 5 años de experiencia en logística. Trabajé en Transporte Global coordinando rutas y reduciendo costos un 15%. Antes fui analista de calidad en Industria Metalúrgica. Hablo inglés avanzado y manejo SAP..."
                        className="w-full h-64 p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none mb-4"
                    />

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Redactando tu CV Profesional...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-wand-magic-sparkles"></i> Generar CV Automáticamente
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/cv-maker" className="text-gray-500 hover:text-white text-sm transition-colors">
                        &larr; Volver
                    </Link>
                </div>
            </div>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
