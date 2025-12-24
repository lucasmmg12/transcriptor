'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CVMakerLanding() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/10">
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
                            <span className="text-sm font-medium text-gray-400">CV Maker</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-20 flex flex-col items-center">

                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
                    <div className="inline-block p-4 rounded-full bg-green-500/10 text-green-400 mb-6 border border-green-500/20">
                        <i className="fas fa-file-invoice text-3xl"></i>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                        Crea tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Curriculum</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Elige cómo quieres empezar. Puedes tener control total de cada detalle o dejar que nuestra Inteligencia Artificial haga el trabajo pesado por ti.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full animate-slide-in">

                    {/* Option 1: AI Mode */}
                    <Link href="/cv-maker/ai" className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative h-full glass-card p-10 rounded-3xl border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 flex flex-col">
                            <div className="absolute top-6 right-6">
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-500/30">
                                    RECOMENDADO
                                </span>
                            </div>

                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                                <i className="fas fa-wand-magic-sparkles text-4xl text-white"></i>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                                Asistente IA
                            </h3>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed flex-1">
                                ¿No sabes por dónde empezar? Cuéntanos tu historia, pega tu experiencia desordenada o tus notas, y la IA redactará y estructurará un CV profesional para ti en segundos.
                            </p>

                            <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:gap-4 transition-all">
                                <span>Usar Inteligencia Artificial</span>
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </Link>

                    {/* Option 2: Manual Mode */}
                    <Link href="/cv-maker/manual" className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative h-full glass-card p-10 rounded-3xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex flex-col">

                            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <i className="fas fa-pencil-alt text-4xl text-white"></i>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">
                                Modo Manual
                            </h3>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed flex-1">
                                Para quienes prefieren el control total. Rellena cada sección campo por campo con nuestro editor visual en tiempo real. Ideal si ya tienes tu información clara.
                            </p>

                            <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                                <span>Empezar desde cero</span>
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </Link>

                </div>

            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
