'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CVMakerLanding() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            {/* Elemento de Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 relative z-50">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    <Image src="/logogrow.png" alt="Grow Labs Logo" fill className="object-cover" />
                                </div>
                                <span className="font-bold text-lg tracking-tight hidden md:inline text-gray-900">Grow Labs</span>
                            </Link>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span className="text-sm font-medium text-gray-500">CV Maker</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex flex-col items-center">

                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in relative">
                    <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-6 border border-green-100 shadow-sm">
                        <i className="fas fa-file-invoice text-3xl"></i>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                        Crea tu <span className="text-green-600">Curriculum</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        Elige cómo quieres empezar. Puedes tener control total de cada detalle o dejar que nuestra Inteligencia Artificial construya tu perfil profesional.
                    </p>
                </div>

                {/* ATS Information Block */}
                <div className="max-w-4xl w-full mb-16 animate-fade-in-up">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <i className="fas fa-robot text-8xl text-gray-900"></i>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm border border-green-100">
                                    <i className="fas fa-lightbulb"></i>
                                </span>
                                ¿Por qué es importante optimizar tu CV?
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">Lectura por IA (ATS)</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">Hoy en día, muchos CVs son filtrados primero por bots. Tu CV debe ser legible para ellos.</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">Información Precisa</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">Evita el relleno. Destaca solo lo que aporta valor real al puesto que buscas.</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">Palabras Clave</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">Si buscas un puesto de "Ventas", asegúrate de que esa palabra destaque en tu perfil.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full animate-slide-in">

                    {/* Option 1: AI Mode */}
                    <Link href="/cv-maker/ai" className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="relative h-full bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 flex flex-col hover:-translate-y-1">
                            <div className="absolute top-6 right-6">
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-200">
                                    RECOMENDADO
                                </span>
                            </div>

                            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-8 border border-green-100 group-hover:bg-green-100 group-hover:scale-105 transition-all duration-300">
                                <i className="fas fa-wand-magic-sparkles text-3xl md:text-4xl text-green-600"></i>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                Asistente IA
                            </h3>
                            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed flex-1">
                                ¿No sabes por dónde empezar? Cuéntanos tu historia, pega tu experiencia desordenada o tus notas, y la IA redactará y estructurará un CV profesional para ti en segundos.
                            </p>

                            <div className="flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all uppercase tracking-wide text-sm">
                                <span>Usar Inteligencia Artificial</span>
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </Link>

                    {/* Option 2: Manual Mode */}
                    <Link href="/cv-maker/manual" className="group relative">
                        <div className="absolute inset-0 bg-gray-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="relative h-full bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col hover:-translate-y-1">

                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-200 group-hover:bg-gray-100 group-hover:scale-105 transition-all duration-300">
                                <i className="fas fa-pencil-alt text-3xl md:text-4xl text-gray-700"></i>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 transition-colors">
                                Modo Manual
                            </h3>
                            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed flex-1">
                                Para quienes prefieren el control total. Rellena cada sección campo por campo con nuestro editor visual en tiempo real. Ideal si ya tienes tu información clara.
                            </p>

                            <div className="flex items-center gap-2 text-gray-700 font-bold group-hover:gap-4 transition-all uppercase tracking-wide text-sm">
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
