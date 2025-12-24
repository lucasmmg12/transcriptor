'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PresentationTool() {
    const [loadingPresentation, setLoadingPresentation] = useState(false);
    const [presentationData, setPresentationData] = useState<any>(null);
    const [presentationTemplate, setPresentationTemplate] = useState<'standard' | 'medical'>('standard');
    const [textoPresentacion, setTextoPresentacion] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerarPresentacion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textoPresentacion.trim()) {
            setError('Por favor ingresa el texto para generar la presentación');
            return;
        }

        setLoadingPresentation(true);
        setError(null);
        setPresentationData(null);

        try {
            const response = await fetch('/api/generar-presentacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    texto: textoPresentacion,
                    template: presentationTemplate
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.details
                    ? `${data.error}: ${data.details}`
                    : (data.error || 'Error al generar la presentación');
                throw new Error(errorMessage);
            }

            setPresentationData(data.data);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al generar la presentación');
        } finally {
            setLoadingPresentation(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/10 print:hidden">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <Image
                                    src="/logogrow.png"
                                    alt="Grow Labs Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                />
                                <span className="font-bold text-xl tracking-tight hidden md:inline">GROW LABS</span>
                            </Link>
                            <span className="hidden md:inline text-gray-700">|</span>
                            <span className="text-sm font-medium text-gray-400">Slides Generator</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                {!presentationData ? (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <div className="text-center mb-12">
                            <div className="inline-block p-4 rounded-full bg-purple-500/10 text-purple-400 mb-6">
                                <i className="fas fa-magic text-3xl"></i>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6">
                                Generador de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Presentaciones IA</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Convierte textos, notas o reportes en presentaciones visuales de alto impacto listas para exportar a PDF.
                            </p>
                        </div>

                        <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                            <form onSubmit={handleGenerarPresentacion}>
                                <div className="mb-8">
                                    <label className="block text-lg font-bold mb-4 flex items-center gap-2">
                                        <i className="fas fa-paragraph text-purple-400"></i>
                                        Tu Contenido
                                    </label>
                                    <textarea
                                        value={textoPresentacion}
                                        onChange={(e) => setTextoPresentacion(e.target.value)}
                                        placeholder="Pega aquí el texto, reporte o notas que deseas convertir en presentación..."
                                        className="w-full h-64 p-6 bg-black/40 border border-white/10 rounded-xl text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none leading-relaxed placeholder-gray-600"
                                        disabled={loadingPresentation}
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>Recomendado: 500-2000 palabras</span>
                                        <span>{textoPresentacion.length} caracteres</span>
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <label className="block text-lg font-bold mb-4 flex items-center gap-2">
                                        <i className="fas fa-palette text-purple-400"></i>
                                        Estilo Visual
                                    </label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setPresentationTemplate('standard')}
                                            className={`cursor-pointer p-6 rounded-xl border-2 transition-all group ${presentationTemplate === 'standard'
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-white/5 bg-white/5 hover:border-purple-500/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-white text-lg">🎭 Visual Novel</h4>
                                                {presentationTemplate === 'standard' && <i className="fas fa-check-circle text-purple-500"></i>}
                                            </div>
                                            <p className="text-sm text-gray-400 group-hover:text-gray-300">Diseño artístico y moderno. Ideal para contar historias, pitches y presentaciones creativas con alto impacto visual.</p>
                                        </div>

                                        <div
                                            onClick={() => setPresentationTemplate('medical')}
                                            className={`cursor-pointer p-6 rounded-xl border-2 transition-all group ${presentationTemplate === 'medical'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-white/5 bg-white/5 hover:border-blue-500/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-white text-lg">🏥 Corporativo / Médico</h4>
                                                {presentationTemplate === 'medical' && <i className="fas fa-check-circle text-blue-500"></i>}
                                            </div>
                                            <p className="text-sm text-gray-400 group-hover:text-gray-300">Formato limpio y profesional. Estructura formal ideal para reportes, clínicas y datos técnicos.</p>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loadingPresentation || !textoPresentacion.trim()}
                                    className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                                >
                                    {loadingPresentation ? (
                                        <>
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Diseñando diapositivas...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generar Presentación</span>
                                            <i className="fas fa-wand-magic-sparkles"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div id="presentation-container" className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 sticky top-24 z-40 glass p-6 rounded-2xl border border-white/10 shadow-2xl print:hidden animate-fade-in-down">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {presentationData?.titulo_presentacion}
                                </h3>
                                <p className="text-gray-400 text-sm">Generado por Grow Labs AI</p>
                            </div>
                            <div className="flex gap-4 mt-4 md:mt-0">
                                <button
                                    onClick={() => setPresentationData(null)}
                                    className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                >
                                    ← Crear Nueva
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="px-8 py-3 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <i className="fas fa-download"></i>
                                    Descargar PDF
                                </button>
                            </div>
                        </div>

                        <div className="space-y-16 print:space-y-0 pb-24">
                            {(presentationData?.slides || []).map((slide: any, index: number) => (
                                <div
                                    key={index}
                                    className="slide-page aspect-video relative overflow-hidden shadow-2xl print:shadow-none bg-black text-white rounded-2xl print:rounded-none ring-1 ring-white/10 print:ring-0 break-after-page"
                                >
                                    {/* Background Image with Dark Overlay - Always Present */}
                                    <div
                                        className="absolute inset-0 z-0 bg-cover bg-center print:opacity-100" // Ensure background prints
                                        style={{
                                            backgroundImage: "url('/fondogrow.png')",
                                        }}
                                    />

                                    {/* Dark overlay for readability - Vary opacity based on slide type */}
                                    <div className={`absolute inset-0 z-0 mix-blend-multiply ${slide.tipo === 'frase_impacto' ? 'bg-gray-900/95' : 'bg-gray-900/90'
                                        }`} />

                                    {/* Decorative Gradients (Subtler) */}
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-500/5 to-blue-500/5 z-0"></div>

                                    {/* Grow Labs Logo - Circular Frame */}
                                    <div className="absolute top-8 right-8 z-20 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-xl print:shadow-none print:opacity-100 overflow-hidden p-3 md:p-4">
                                        <Image src="/logogrow.png" alt="Grow Labs" width={100} height={100} className="object-contain" />
                                    </div>

                                    {/* Slide Content Container */}
                                    <div className="relative z-10 w-full h-full flex flex-col p-12 md:p-16">

                                        {/* Header: Slide Number & Type (Hidden on Title/Quote slides for clean look) */}
                                        {slide.tipo !== 'titulo' && slide.tipo !== 'frase_impacto' && (
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-mono uppercase tracking-wider border border-white/20">
                                                        Slide {index + 1} / {presentationData.slides.length}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Dynamic Content Rendering */}
                                        <div className="flex-1 flex flex-col justify-center">

                                            {/* TIPO: TITULO (Portada) */}
                                            {slide.tipo === 'titulo' && (
                                                <div className="text-center max-w-5xl mx-auto h-full flex flex-col justify-center">
                                                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-600 mx-auto mb-12 rounded-full"></div>
                                                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                                                        {slide.titulo}
                                                    </h1>
                                                    {presentationData.subtitulo && (
                                                        <p className="text-2xl md:text-3xl text-gray-300 font-light mb-16 max-w-3xl mx-auto border-b border-gray-700/50 pb-8">
                                                            {presentationData.subtitulo}
                                                        </p>
                                                    )}
                                                    <div className="flex justify-center gap-12 text-sm text-gray-400 flex-wrap">
                                                        {slide.contenido.map((item: string, i: number) => (
                                                            <div key={i} className="flex flex-col items-center gap-2">
                                                                <span className="uppercase tracking-widest font-bold text-green-400">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* TIPO: FRASE IMPACTO (Quote) */}
                                            {slide.tipo === 'frase_impacto' && (
                                                <div className="text-center max-w-6xl mx-auto h-full flex flex-col justify-center relative">
                                                    <div className="absolute top-0 left-0 text-green-500/20 text-9xl font-serif">“</div>
                                                    <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-snug mb-8 relative z-10">
                                                        {slide.contenido}
                                                    </h2>
                                                    <div className="w-32 h-1 bg-green-500 mx-auto rounded-full"></div>
                                                </div>
                                            )}

                                            {/* TIPO: SPLIT CONTENT (2 Columnas) */}
                                            {slide.tipo === 'split_content' && (
                                                <div className="h-full flex flex-col">
                                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 flex items-center gap-6">
                                                        <span className="w-12 h-2 bg-green-500"></span>
                                                        {slide.titulo}
                                                    </h2>
                                                    <div className="flex-1 grid grid-cols-2 gap-12 items-center">
                                                        <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed text-justify font-light">
                                                            {slide.columna_izquierda.map((p: string, i: number) => (
                                                                <p key={i}>{p}</p>
                                                            ))}
                                                        </div>
                                                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 h-full flex flex-col justify-center gap-6 backdrop-blur-sm">
                                                            {slide.columna_derecha.map((item: string, i: number) => (
                                                                <div key={i} className="flex items-start gap-4">
                                                                    <div className="w-2 h-2 mt-3 rounded-full bg-blue-400 flex-shrink-0"></div>
                                                                    <p className="text-xl font-medium text-white">{item}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* TIPO: GRID CARDS (Puntos Clave) */}
                                            {slide.tipo === 'grid_cards' && (
                                                <div className="h-full flex flex-col">
                                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 flex items-center gap-6">
                                                        <span className="w-12 h-2 bg-blue-500"></span>
                                                        {slide.titulo}
                                                    </h2>
                                                    <div className="flex-1 grid grid-cols-2 gap-8">
                                                        {slide.contenido.map((card: any, i: number) => (
                                                            <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/5 flex flex-col justify-center">
                                                                <h3 className="text-xl font-bold text-green-400 mb-2">{card.titulo}</h3>
                                                                <p className="text-gray-300 text-lg leading-relaxed">{card.texto}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* TIPO: ESTÁNDAR (Fallback) */}
                                            {(!slide.tipo || (slide.tipo !== 'titulo' && slide.tipo !== 'frase_impacto' && slide.tipo !== 'split_content' && slide.tipo !== 'grid_cards')) && (
                                                <div className="h-full flex flex-col">
                                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">
                                                        {slide.titulo}
                                                    </h2>
                                                    <div className="flex-1 overflow-visible">
                                                        {Array.isArray(slide.contenido) ? (
                                                            <ul className="space-y-6">
                                                                {slide.contenido.map((item: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-4 text-xl md:text-2xl text-gray-300 font-light">
                                                                        <span className="text-green-500 mt-2 text-xs">●</span>
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed whitespace-pre-line font-light">
                                                                {slide.contenido}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
